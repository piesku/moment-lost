import { Move, Transform } from "cervus/components";

import { play_footstep } from "./audio";
import { distance } from "./math";

export default class Walk extends Move {
  constructor(options) {
    super(options);
    this.traveled = 0;
    this.footstep_every = 15;
  }
  handle_keys(tick_delta, keys) {
    const transform = this.entity.get_component(Transform);
    const prev_position = transform.position;
    super.handle_keys(tick_delta, keys);
    this.traveled += distance(prev_position, transform.position);

    if (this.traveled > this.footstep_every) {
      this.traveled %= this.footstep_every;
      play_footstep();
    }
  }
}
