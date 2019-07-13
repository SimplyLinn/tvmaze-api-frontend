import Dexie from 'dexie';
import { getAllWords } from './utils';

const db = new Dexie("ShowsDatabase");
db.version(4).stores({
  shows: "id,name,*nameWords",
  //episodes: "id,showId,"
});

db.shows.hook("creating", function (primKey, obj, trans) {
  if (typeof obj.name === 'string') obj.nameWords = getAllWords(obj.name);
  if (typeof obj.thumbUrl === 'string' && obj.thumbUrl.startsWith('http:')) {
    obj.thumbUrl = 'https' + obj.thumbUrl.substring(4);
  }
  if (typeof obj.imageUrl === 'string' && obj.imageUrl.startsWith('http:')) {
    obj.imageUrl = 'https' + obj.imageUrl.substring(4);
  }
});

db.shows.hook("updating", function (mods, primKey, obj, trans) {
  const newMods = {}
  if (mods.hasOwnProperty("name")) {
    // "name" property is being updated
    if (typeof mods.name == 'string')
      // "name" property was updated to another valid value. Re-index nameWords:
      newMods.nameWords = getAllWords(mods.name);
    else
      // "name" property was deleted (typeof mods.name === 'undefined') or changed to an unknown type. Remove indexes:
      newMods.nameWords = [];
  }

  if (mods.hasOwnProperty("thumbUrl")) {
    if (typeof obj.thumbUrl === 'string' && obj.thumbUrl.startsWith('http:')) {
      newMods.thumbUrl = 'https' + obj.thumbUrl.substring(4);
    }
  }

  if (mods.hasOwnProperty("imageUrl")) {
    if (typeof obj.imageUrl === 'string' && obj.imageUrl.startsWith('http:')) {
      newMods.imageUrl = 'https' + obj.imageUrl.substring(4);
    }
  }

  return newMods;
});

const Show = db.shows.defineClass ({
  id: Number,
  name: String,
  nameWords: [String],
  updated: Number,
  thumb: Blob,
  thumbUrl: String,
  imageUrl: String,
  type: String,
  summary: String,
  genres: [String],
});

Show.prototype.save = function () {
  return db.shows.put(this);
}

export default db;
export { Show };
