import { Component } from "cervus/core";
import { Transform } from "cervus/components";

import { play_footstep } from "./audio";
import { distance } from "./math";

export default class Footsteps extends Component {
  mount() {
    this.transform = this.entity.get_component(Transform);
    this.footstep_every = 15;
    this.prev_position = this.transform.position;

    this.traveled = 0;
  }

  update() {
    this.traveled += distance(this.prev_position, this.transform.position);
    this.prev_position = this.transform.position;

    if (this.traveled > this.footstep_every) {
      this.traveled %= this.footstep_every;
      play_footstep();
    }
  }
}
