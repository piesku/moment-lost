import { Game } from "cervus/core";
import { Plane, Box } from "cervus/shapes";
import { basic } from "cervus/materials";
import { quat } from "cervus/math";
import * as random from "./random";

const WORLD_SIZE = 1000;

export function create_level() {
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

  const color = random.color();

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
    const snap = game.canvas.toDataURL();
    window.dispatch(
      'SNAPSHOT_TAKEN', snap, game.camera.position, game.camera.rotation
    );
    game.stop();
  });

  return game;
}

export function start_level(game) {
  game.camera.position = random.position([0, 0], WORLD_SIZE / 2);
  game.camera.rotation = quat.create();
  game.camera.keyboard_controlled = true;
  game.camera.mouse_controlled = true;

  for (const entity of game.entities) {
    entity.color = "#000000";
  }

  game.start();
}

export function end_level(game) {
  game.stop();
  // Compare the position and the orientation of the camera with the target.
  // Target can be an empty entity in the game.
  return Math.random();
}
