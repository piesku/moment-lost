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
  return Math.sqrt(Math.pow(1 - x, 2));
}

function position_score(target, current, world_size) {
  const dist = distance(target, current);
  const max_distance = Math.sqrt(world_size * world_size) / 2;
  return Math.max(0, 1 - dist / max_distance);
}

function rotation_score(target, current) {
  return Math.abs(dot(target, current));
}

/*
 * Calculate the hint in range [0, 1].
 *
 * This takes into account the fact that the user might be looking _at_ the
 * target, too.  The hint is only used to scale the luminance of the world.
 */
export function get_hint(target, camera, world_size) {
  const transform = camera.get_component(Transform);
  const dummy = camera.get_component(DummyLookAt);

  const p = position_score(target.position, transform.position, world_size);
  const current = rotation_score(target.rotation, transform.rotation);
  const to_target = rotation_score(transform.rotation, dummy.rotation);

  // Weigh the current rotation on an ascending quarter circle and the
  // to_target rotation on a descending one.  The sum of the weights is
  // always 1.  This essentially translates to:  the closer to the target the
  // user is, the more the alignment with the target's rotation counts, and the
  // less the fact that they're looking _at_ the target does.
  const r = current * (1 - smooth(p)) + to_target * smooth(p);

  // Halve the average so that the hint in not too obvious.
  return (p + r) / 2 / 2;
}

/*
 * Calculate the final score for the level in range [0, 1].
 */
export function get_score(target, camera, world_size) {
  const transform = camera.get_component(Transform);

  const p = position_score(target.position, transform.position, world_size);
  const r = rotation_score(target.rotation, transform.rotation);

  // See https://slack-files.com/T137YH5CK-F70S69J0J-51a91c0eaa
  // The division normalizes the result in the [0, 1] range.
  return (p * Math.sin(r) + r * Math.sin(p)) / (2 * Math.sin(1));
}
