// XXX Add these functions to cervus/math.

import { vec3 } from "cervus/math";

export function dot(a, b) {
  return a.reduce((acc, cur, idx) => acc + cur * b[idx], 0);
}

function magnitude(a) {
  return Math.sqrt(dot(a, a));
}

export function distance(a, b) {
  const dist = vec3.zero.slice();
  vec3.subtract(dist, a, b);
  return magnitude(dist);
}
