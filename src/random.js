import { rgb_to_hex, hsl_to_rgb } from "cervus/utils";

export function integer_between(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function element_of(arr) {
  return arr[integer_between(0, arr.length - 1)];
}

export function color() {
  const rgb = hsl_to_rgb(Math.random(), 0.7, 0.6);
  return rgb_to_hex(rgb);
}
