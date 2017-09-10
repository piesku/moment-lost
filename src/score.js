import { Transform } from "cervus/components";

import { distance, dot } from "./math";

export class DummyLookAt extends Transform {
  update() {
    this.position = this.entity.get_component(Transform).position;
    this.look_at(this.target.position);
  }
}

/*
 * Descending quarter circle for x in [0, 1].
 */
function smooth(x) {
  return Math.sqrt(1 - x ** 2);
}

function position_score(target, current, world_size) {
  const dist = distance(target, current);
  const max_distance = Math.sqrt(world_size * world_size) / 2;
  return Math.max(0, 1 - dist / max_distance);
}

function rotation_score(target, current) {
  return Math.abs(dot(target, current));
}

export function get_hint(target, camera, world_size) {
  const transform = camera.get_component(Transform);
  const dummy = camera.get_component(DummyLookAt);

  const p = position_score(target.position, transform.position, world_size);
  const current = rotation_score(target.rotation, transform.rotation);
  const to_target = rotation_score(transform.rotation, dummy.rotation);

  // Weigh the current rotation on an ascending quarter circle and the
  // to_target rotation on a descending one.
  const r = current * (1 - smooth(p)) + to_target * smooth(p);

  // Halve the avergae so that it's not too obvious.
  return (p + r) / 2 / 2;
}

export function get_score(target, camera, world_size) {
  const transform = camera.get_component(Transform);
  const dummy = camera.get_component(DummyLookAt);

  const p = position_score(target.position, transform.position, world_size);
  const current = rotation_score(target.rotation, transform.rotation);
  // Weigh the rotation on an ascending quarter circle.
  const r = current * (1 - smooth(p));

  return (p + r) / 2;
}
