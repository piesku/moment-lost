import { distance, dot } from "./math";

function position_score(target, current, world_size) {
  const dist = distance(target, current);
  const max_distance = Math.sqrt(world_size * world_size) / 2;
  return 1 - dist / max_distance;
}

function rotation_score(target, current) {
  return Math.abs(dot(target, current));
}

export default function get_score(target, camera, world_size) {
  const p = position_score(target.position, camera.position, world_size);
  const r = rotation_score(target.rotation, camera.rotation);
  // XXX This shouldn't be just a simple average.  If you're 1000 meters from
  // the target but happen to be looking in the same direction, the score
  // shouldn't be ~50%.
  return (p + r) / 2;
}
