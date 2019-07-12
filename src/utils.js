export function sleep(ms) {
  return new Promise((res)=>setTimeout(res,ms));
}

export function getCurTime() {
  return (new Date).getTime();
}

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function getAllWords(text) {
  /// <param name="text" type="String"></param>
  const wordSet = new Set();
  text.toLowerCase().split(' ').forEach(w=>w&&wordSet.add(w));
  return [...wordSet];
}