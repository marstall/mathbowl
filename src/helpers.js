export function times(n, f) {
  const results = [];
  let i = 0;
  while (n-- > 0) {
    results.push(f(i++));
  }
  return results;
}

var factor=1
function seededRandom(seed) {
  var x = Math.sin(seed+(factor++)) * 10000;
  return x - Math.floor(x);
}

export function rndWithPlaces(seed,n) {
  return 10 + Math.floor(seededRandom(seed) * (Math.pow(10, n) - 10));
}

export function numToPlaces(n) {
  return n.toString().split("").map(i=>parseInt(i));
}

export const clog = console.log;
