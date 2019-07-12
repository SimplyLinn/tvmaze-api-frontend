import Api from './tvmazeApi';
import db, { Show } from './database';
import { getCurTime, escapeRegExp, getAllWords } from './utils';
import stringSimilarity from 'string-similarity';

window.db = db;
const DAY_IN_MILLIS = 24*60*60*1000;
const PAGE_SIZE = 250;

class TVMazeController {
  constructor() {
    const timeStr = localStorage.getItem('lastUpdated') || "0";
    const timeNum = Number.parseInt(timeStr);
    this._lastUpdated = new Date(timeNum > 0 ? timeNum : 0);

    if(getCurTime() - this.lastUpdated.getTime() > DAY_IN_MILLIS) {
      this.refreshShows();
    } else {
      this.getNewShows();
    }
  }

  get useLocal() {
    // Use local DB if it's fresh enough, or you're offline.
    return navigator.onLine === false || getCurTime() - this.lastUpdated.getTime() < DAY_IN_MILLIS * 3;
  }

  get lastUpdated() {
    return this._lastUpdated;
  }

  set lastUpdated(val) {
    if(!(val instanceof Date)) {
      throw new TypeError('lastUpdated needs to be a Date');
    }
    localStorage.setItem('lastUpdated', val.getTime()+'');
    this._lastUpdated = val;
  }

  searchTypingFirstWord(word) {
    return db.shows.where("nameWords").startsWithIgnoreCase(word).distinct().toArray();
  }

  searchLastCharSpace(typedTermArr) {
    return db.transaction('r', 'shows', async ()=>{
      const results = await Promise.all(typedTermArr.map(term=>db.shows.where("nameWords").equalsIgnoreCase(term).distinct().primaryKeys()));
      const ids = results.reduce((wArr, cArr) => {
        const res = [];
        for (let i = 0; i < wArr.length; i++) {
          if(cArr.includes(wArr[i])) res.push(wArr[i]);
        }
        return res;
      });
      return await db.shows.where(':id').anyOf(ids).toArray();
    });
  }

  searchTypingMultipleWords(lastWord, typedTermArr) {
    return db.transaction('r', 'shows', async ()=>{
      const results = await Promise.all(typedTermArr.map(term=>db.shows.where("nameWords").equalsIgnoreCase(term).distinct().primaryKeys()));
      const resultTyping = await db.shows.where("nameWords").startsWithIgnoreCase(lastWord).distinct().primaryKeys();
      const ids = results.reduce((wArr, cArr) => {
        const res = [];
        for (let i = 0; i < wArr.length; i++) {
          if(cArr.includes(wArr[i])) res.push(wArr[i]);
        }
        return res;
      }, resultTyping);
      return await db.shows.where(':id').anyOf(ids).toArray();
    });
  }

  async search(term, final) {
    const termArr = term.split(' ');
    const lastWord = final ? '' : termArr.pop();
    const typedTermArr = getAllWords(termArr.join(' '));
    let results;
    if(lastWord && !typedTermArr.length) results = await this.searchTypingFirstWord(lastWord);
    else if(!lastWord && typedTermArr.length) results = await this.searchLastCharSpace(typedTermArr);
    else if(lastWord && typedTermArr.length) results = await this.searchTypingMultipleWords(lastWord, typedTermArr);
    else return [];

    // Sort the found results based on string similarity with the name
    const termLower = term.toLowerCase();
    return results.map(e=>({result: e, rating: stringSimilarity.compareTwoStrings(e.name.toLowerCase(), termLower)})).sort((a,b) => b.rating-a.rating);
  }

  parsePage(pageData, pageNum) {
    return db.transaction('rw', db.shows, async ()=>{
      const lowestId = pageNum * PAGE_SIZE;
      const highestId = (pageNum + 1) * PAGE_SIZE;
      console.log(lowestId, highestId)
      const cachedEntries = db.shows.where(':id').between(lowestId, highestId);
      const cachedKeys = await cachedEntries.primaryKeys();
      db.shows.bulkDelete(cachedKeys.filter(id=>!pageData.find(e2=>id === e2.id)));
      for(let i = 0; i < pageData.length; i++) {
        const tvm = pageData[i];
        const cachedShow = (await db.shows.get(tvm.id)) || new Show();
        if(cachedShow.updated === tvm.updated) continue;
        cachedShow.id = tvm.id;
        cachedShow.name = tvm.name;
        cachedShow.updated = tvm.updated;
        cachedShow.imageUrl = tvm.image && tvm.image.original;
        cachedShow.type = tvm.type;
        cachedShow.summary = tvm.summary;
        cachedShow.genres = pageData.genres;

        if(tvm.image && tvm.image.medium && cachedShow.thumbUrl !== tvm.image.medium) {
          cachedShow.thumbUrl = tvm.image.medium;
          cachedShow.thumb = null;
        }

        await cachedShow.save();
      }
    });
  }
  
  async refreshPage(page) {
    try {
      await this.parsePage((await Api.getShowsPage(page)).data, page);
    } catch (err) {
      if(!err.isAxiosError) throw err;
      if(!err.response) throw err;

      // If we 404, we have gone through all pages and should
      // gracefully return that we've reached the last page.
      if(err.response.status === 404) return false;
      
      throw err;
    }

    // If we've gotten here, no errors got thrown, and we also
    // didn't detect the last page having been reached, so 
    // return true to indicate that there might be more
    // pages
    return true;
  }

  async refreshFromId(lastId) {
    lastId = lastId || 0;
    let page = Math.floor(lastId/PAGE_SIZE);
    while(await this.refreshPage(page)) {
      page++;
    }
  }

  async refreshShows() {
    await this.refreshFromId();
    this.lastUpdated = new Date;
  }

  async getNewShows() {
    const lastId = (await db.shows.orderBy(':id').last()).id;
    await this.refreshFromId(lastId);
  }
}

export default new TVMazeController();