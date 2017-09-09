import { vec3 } from "cervus/math";
const SEED = 19870603;

const rand = (function() {
  let seed = SEED;
  return function() {
    seed = seed * 16807 % 2147483647;
    return (seed -1) / 2147483646;
  }
})();

export function integer(min = 0, max = 1) {
  return Math.floor(rand() * (max - min + 1) + min);
}

export function float(min = 0, max = 1) {
  return rand() * (max - min) + min;
}

export function element_of(arr) {
  arr = Array.from(arr);
  return arr[integer(0, arr.length - 1)];
}

/*
 * Random position inside of a circle.
 */
export function position([x, z], max_radius, y = 1.5) {
  const angle = float(0, Math.PI * 2);
  const radius = float(0, max_radius);
  return vec3.of(
    x + radius * Math.cos(angle),
    y,
    z + radius * Math.sin(angle)
  );
}

export function look_at_target(matrix) {
  const azimuth = float(-Math.PI/8, Math.PI/8);
  const polar = float(0, Math.PI / 6);

  const target = vec3.of(
    Math.cos(polar) * Math.sin(azimuth),
    Math.sin(polar),
    Math.cos(polar) * Math.cos(azimuth)
  );
  vec3.normalize(target, target);
  return vec3.transform_mat4(target, target, matrix);
}
