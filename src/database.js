import Dexie from 'dexie';
import { getAllWords } from './utils';

const db = new Dexie("ShowsDatabase");
db.version(3).stores({
  shows: "id,name,*nameWords,status,*genres,updated",
  //episodes: "id,showId,"
});

db.shows.hook("creating", function (primKey, obj, trans) {
  if (typeof obj.name === 'string') obj.nameWords = getAllWords(obj.name);
});

db.shows.hook("updating", function (mods, primKey, obj, trans) {
  if (mods.hasOwnProperty("name")) {
      // "name" property is being updated
      if (typeof mods.name == 'string')
          // "name" property was updated to another valid value. Re-index nameWords:
          return { nameWords: getAllWords(mods.name) };
      else
          // "name" property was deleted (typeof mods.name === 'undefined') or changed to an unknown type. Remove indexes:
          return { nameWords: [] };
  }

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
