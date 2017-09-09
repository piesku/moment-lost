import { Game } from "cervus/core";
import { Plane } from "cervus/shapes";
import { Move, Transform, Render } from "cervus/components";
import { basic } from "cervus/materials";
import { quat } from "cervus/math";
import { rgb_to_hex, hsl_to_rgb } from "cervus/utils";

import { element } from "./level-elements.js";
import * as random from "./random";
import get_score from "./score";

const WORLD_SIZE = 1000;
const SATURATION = 0.7;
const LUMINANCE = 0.6;
const PLAYER_HEIGHT = 1.74;

const props = [];

function hex(hue, lum) {
  const rgb = hsl_to_rgb(hue, SATURATION, lum);
  return rgb_to_hex(rgb);
}

export function create_level(lvl_number, hue) {
  const game = new Game({
    width: window.innerWidth,
    height: window.innerHeight,
    clear_color: "#eeeeee",
    far: WORLD_SIZE
  });

  game.camera.get_component(Move).set({
    keyboard_controlled: false,
    mouse_controlled: false,
    move_speed: 100
  });

  const color = hex(hue, LUMINANCE);

  const floor = new Plane();
  floor.get_component(Transform).scale = [WORLD_SIZE, 1, WORLD_SIZE];
  floor.get_component(Render).set({
    material: basic,
    color
  });

  game.add(floor);

  for (let i = 0; i < Math.pow(lvl_number, 2) + 1; i++) {
    element(i, color).forEach((el) => {
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

  for (const entity of game.entities) {
    entity.get_component(Render).color = "#000000";
  }

  game.start();

  game.on("afterrender", function hint() {
    const score = get_score(target, game.camera.get_component(Transform), WORLD_SIZE);
    // XXX Change color on the material instance?
    for (const entity of game.entities) {
      entity.get_component(Render).color = hex(hue, LUMINANCE * score / 2);
    }
  });
}

export function end_level(game, target) {
  game.stop();
  return get_score(target, game.camera.get_component(Transform), WORLD_SIZE);
}
