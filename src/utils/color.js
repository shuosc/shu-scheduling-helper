import murmur from 'murmurhash-js';

const colors = [
  '#D32F2F',
  '#7B1FA2',
  '#303F9F',
  '#1976D2',
  '#689F38',
  '#FBC02D',
  '#FFA000',
  '#F57C00',
  '#E64A19',
  '#5D4037',
];

let colorCache = {};
let colorSeed = 2;

export function getColorSeed() {
  return colorSeed;
}

export function setColorSeed(seed) {
  if (colorSeed !== seed) {
    colorSeed = seed;
    colorCache = {};
    return true;
  } else {
    return false;
  }
}

export function getColor(str, seed) {
  let key = JSON.stringify([str, seed]);
  if (colorCache.hasOwnProperty(key)) {
    return colorCache[key];
  } else {
    return colorCache[key] = colors[murmur(str, seed + colorSeed) % colors.length];
  }
}
