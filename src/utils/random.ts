function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomArray(size: number, min: number, max: number, seed?: number): number[] {
  const rand = seed !== undefined ? mulberry32(seed) : Math.random;
  return Array.from({ length: size }, () => Math.floor(rand() * (max - min + 1)) + min);
}
