import { vec3 } from "cervus/math";

export function integer(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function float(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

export function element_of(arr) {
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

export function look_at_target(entity) {
  const azimuth = float(0, Math.PI * 2);
  const polar = float(0, Math.PI / 6);

  const target = vec3.of(
    Math.cos(polar) * Math.sin(azimuth),
    Math.sin(polar),
    Math.cos(polar) * Math.cos(azimuth)
  );
  vec3.normalize(target, target);
  return vec3.transform_mat4(target, target, entity.matrix);
}
