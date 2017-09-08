import { Game } from "cervus/core";
import { Plane, Box } from "cervus/shapes";
import { Move, Transform, Render } from "cervus/components";
import { basic } from "cervus/materials";
import { quat } from "cervus/math";
import { rgb_to_hex, hsl_to_rgb } from "cervus/utils";

import * as random from "./random";
import get_score from "./score";

const WORLD_SIZE = 1000;
const SATURATION = 0.7;
const LUMINANCE = 0.6;

function hex(hue, lum) {
  const rgb = hsl_to_rgb(hue, SATURATION, lum);
  return rgb_to_hex(rgb);
}

export function create_level(hue) {
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


  game.camera.get_component(Transform).position = random.position([0, 0], WORLD_SIZE / 3);
  game.camera.get_component(Transform).look_at(random.look_at_target(game.camera.get_component(Transform).matrix));

  const color = hex(hue, LUMINANCE);

  const floor = new Plane();
  floor.get_component(Transform).scale = [WORLD_SIZE, 1, WORLD_SIZE];
  floor.get_component(Render).set({
    material: basic,
    color
  });

  game.add(floor);

  for (let i = 0; i < 20; i++) {
    const sign = Math.cos(i * Math.PI);
    const x = 75 + 100 * Math.sin(i * Math.PI / 6);
    const box = new Box();

    box.get_component(Render).set({
      material: basic,
      color,
    });
    box.get_component(Transform).set({
      position: [sign * x, 20, 20 * i],
      scale: [90, 40, 15]
    });
    game.add(box);
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
  game.camera.get_component(Transform).position = random.position([0, 0], WORLD_SIZE / 2);
  game.camera.get_component(Transform).rotation = quat.create();
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
