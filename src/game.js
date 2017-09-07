import { Game } from "cervus/core";
import { Plane, Box } from "cervus/shapes";
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

  game.camera.keyboard_controlled = false;
  game.camera.mouse_controlled = false;
  game.camera.move_speed = 10;

  game.camera.position = random.position([0, 0], WORLD_SIZE / 3);
  game.camera.look_at(random.look_at_target(game.camera));

  const color = hex(hue, LUMINANCE);

  game.add(new Plane({
    material: basic,
    color,
    scale: [WORLD_SIZE, 1, WORLD_SIZE]
  }));

  for (let i = 0; i < 20; i++) {
    const sign = Math.cos(i * Math.PI);
    const x = 75 + 100 * Math.sin(i * Math.PI / 6);
    game.add(new Box({
      material: basic,
      color,
      position: [sign * x, 20, 20 * i],
      scale: [90, 40, 15]
    }));
  }

  game.on("afterrender", function take_snapshot() {
    game.off("afterrender", take_snapshot);
    const target = {
      snapshot: game.canvas.toDataURL(),
      position: game.camera.position,
      rotation: game.camera.rotation,
    };
    window.dispatch('SNAPSHOT_TAKEN', target);
    game.stop();
  });

  return game;
}

export function start_level(game, hue, target) {
  game.camera.position = random.position([0, 0], WORLD_SIZE / 2);
  game.camera.rotation = quat.create();
  game.camera.keyboard_controlled = true;
  game.camera.mouse_controlled = true;

  for (const entity of game.entities) {
    entity.color = "#000000";
  }

  game.start();

  game.on("afterrender", function hint() {
    const score = get_score(target, game.camera, WORLD_SIZE);
    // XXX Change color on the material instance?
    for (const entity of game.entities) {
      entity.color = hex(hue, LUMINANCE * score / 2);
    }
  });
}

export function end_level(game, target) {
  game.stop();
  return get_score(target, game.camera, WORLD_SIZE);
}
