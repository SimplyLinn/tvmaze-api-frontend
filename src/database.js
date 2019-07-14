import Dexie from 'dexie';
import { getAllWords } from './utils';

const db = new Dexie("ShowsDatabase");
db.version(8).stores({
  shows: "id,*nameWords"
});


const Show = db.shows.defineClass ({
  id: Number,
  name: String,
  nameWords: [String],
  premiered: String,
  updated: Number,
  thumb: Blob,
  thumbUrl: String,
  imageUrl: String,
  type: String,
  summary: String,
  genres: [String],
  episodes: [{
    name: String,
    season: Number,
    number: Number,
    summary: String,
    thumb: null,
    thumbUrl: String,
    imageUrl: String,
    airstamp: Date,
  }],
  episodesFetched: Date,
});

Show.prototype.save = function () {
  return db.shows.put(this);
}

export default db;
export { Show };
