const OfflinePlugin = require('offline-plugin');
const path = require('path');
const fs = require('fs');

const staticDir = path.join(__dirname, 'public', 'static');

function flat(arr) {
  const flatArr = [];
  for(let el of arr) {
    flatArr.push(...(Array.isArray(el) ? flat(el) : [el]));
  }
  return flatArr;
}

function readDirRecursive(dir, base) {
  base = base || "";
  return flat(fs.readdirSync(dir).map(f=>fs.lstatSync(path.join(dir,f)).isDirectory() ? readDirRecursive(path.join(dir,f),base+f+'/') : base+f));
}

module.exports = {
  configureWebpack: {
    plugins: [
      new OfflinePlugin({
        responseStrategy: 'network-first',
        caches: 'all',
        excludes: [
          '/CNAME',
        ],
        externals: [
          '/favicon.ico',
          '/manifest.json',
          ...readDirRecursive(staticDir, '/static/')
        ]
      })
    ]
  }
};