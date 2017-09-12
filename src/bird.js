import { bird_model_vertices, bird_model_indices } from './bird-model';
import { Transform, Render, Morph } from "cervus/components";
import { Entity } from "cervus/core";
import { basic } from "cervus/materials";
import * as random from "./random";
import { VecTween } from "cervus/tweens";
import { play_bird_sound } from "./audio";

const tween_time = 4; // <- seconds
const bird_model = bird_model_vertices.map(v => ({
  vertices: v,
  indices: bird_model_indices
}));
export function spawn_birds(position, color, radius, qty, game) {
  play_bird_sound(position);
  for (let i = 0; i < qty; i++) {
    setTimeout(() => {
      const target_position = random.position([position[0], position[2]], radius, 100);
      const bird = new Entity({
        components: [
          new Transform({
            position: position,
            scale: [0.2, 0.2, 0.2]
          }),
          new Render({
            material: basic,
            color
          }),
          new Morph({
            frame_time: 16
          })
        ]
      });

      bird.get_component(Morph).frames = bird_model;
      bird.get_component(Transform).look_at(target_position);
      bird.get_component(Transform).rotate_ud(Math.PI/2);
      bird.get_component(Morph).create_buffers();
      game.add(bird);

      new VecTween({
        object: bird.get_component(Transform),
        property: 'position',
        to: target_position,
        time: tween_time * 1000,
        game: game
      }).start().then(() => {
        game.remove(bird);
      });
    }, i*15);
  }
}
