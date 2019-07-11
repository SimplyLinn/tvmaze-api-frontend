import Dexie from 'dexie';

const db = new Dexie("ShowsDatabase");
db.version(1).stores({
  shows: "id,name,status,*genres",
  //episodes: "id,showId,"
});

db.shows.defineClass ({
  id: Number,
  name: String,
  image: String,
  imageOrg: String,
  type: String,
  summary: String,
  genres: [String]
});
