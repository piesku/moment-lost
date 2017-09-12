import { Game } from "cervus/core";
import { Plane } from "cervus/shapes";
import { Move, Transform, Render } from "cervus/components";
import { basic } from "cervus/materials";
import { quat } from "cervus/math";
import { rgb_to_hex, hsl_to_rgb } from "cervus/utils";

import { element } from "./level-elements.js";
import * as random from "./random";
import { DummyLookAt, get_score, get_hint } from "./score";
import Footsteps from "./footsteps";

import { distance } from "gl-matrix/src/gl-matrix/vec3";
import { spawn_birds } from "./bird";

const WORLD_SIZE = 1000;
const SATURATION = 0.7;
const LUMINANCE = 0.6;
const PLAYER_HEIGHT = 1.74;

let props = [];
let birds_positions = [];

function hex(hue, lum) {
  const rgb = hsl_to_rgb(hue, SATURATION, lum);
  return rgb_to_hex(rgb);
}

export function create_level(lvl_number, hue) {
  random.set_seed(random.base_seed * lvl_number);
  props = [];
  birds_positions = [];
  const game = new Game({
    width: window.innerWidth,
    height: window.innerHeight,
    clear_color: "#eeeeee",
    far: WORLD_SIZE
  });

  game.camera.add_component(new Move({
    keyboard_controlled: false,
    mouse_controlled: false,
    move_speed: 25,
    rotate_speed: .5,
  }));

  const color = hex(hue, LUMINANCE);

  const floor = new Plane();
  floor.get_component(Transform).scale = [WORLD_SIZE, 1, WORLD_SIZE];
  floor.get_component(Render).set({
    material: basic,
    color
  });

  game.add(floor);

  for (let i = 0; i < Math.pow(lvl_number, 2) + 1; i++) {
    element(i, color, random.integer(0, 2)).forEach((el) => {
      props.push(el);
      game.add(el);
    });
  }

  game.camera.get_component(Transform).position = random.position([0, 0], WORLD_SIZE / 3);
  game.camera.get_component(Transform).look_at(
    random.element_of(props).get_component(Transform).position
  );
  game.camera.get_component(Transform).look_at(
    random.look_at_target(game.camera.get_component(Transform).matrix)
  );

  const spawners = random.integer(4, 14);
  for (let i = 0; i < spawners; i++) {
    const birds_position = random.position([0, 0], WORLD_SIZE/3);
    birds_positions.push(birds_position);

    // XXX: Uncomment here to see birds' spawning points

    // const bird_spawner = element(1, color, 3)[0];
    // bird_spawner.get_component(Transform).set({
    //   position: birds_position
    // });
    // game.add(bird_spawner);
  }


  game.on("afterrender", function take_snapshot() {
    game.off("afterrender", take_snapshot);
    const target = {
      snapshot: game.canvas.toDataURL(),
      position: game.camera.get_component(Transform).position,
      rotation: game.camera.get_component(Transform).rotation,
    };
    window.dispatch('SNAPSHOT_TAKEN', target);
    game.stop();
  });

  return game;
}

export function start_level(game, hue, target) {
  game.camera.get_component(Transform).set({
    position: [0, PLAYER_HEIGHT, 0],
    rotation: quat.create()
  });

  game.camera.get_component(Move).keyboard_controlled = true;
  game.camera.get_component(Move).mouse_controlled = true;
  game.camera.add_component(new DummyLookAt({target}));
  game.camera.add_component(new Footsteps());

  for (const entity of game.entities) {
    entity.get_component(Render).color = "#000000";
  }

  game.start();

  game.on("tick", () => {
    for (let i = 0; i < birds_positions.length; i++) {
      if (distance(birds_positions[i], game.camera.get_component(Transform).position) < 15) {
        spawn_birds(
          birds_positions[i],
          hex(hue, LUMINANCE * get_hint(target, game.camera, WORLD_SIZE)),
          WORLD_SIZE/5,
          25,
          game
        );
        birds_positions.splice(i, 1);
        break;
      }
    }
  });

  game.on("afterrender", function hint() {
    const hint = get_hint(target, game.camera, WORLD_SIZE);
    // XXX Change color on the material instance?
    for (const entity of game.entities) {
      entity.get_component(Render).color = hex(hue, LUMINANCE * hint);
    }
  });
}

export function end_level(game, target) {
  game.stop();
  return get_score(target, game.camera, WORLD_SIZE);
}
