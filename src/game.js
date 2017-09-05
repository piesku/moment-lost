import { Game } from 'cervus/core';
import { Plane, Box } from 'cervus/shapes';
import { basic } from 'cervus/materials';

function integer_between(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function random_element(arr) {
  return arr[integer_between(0, arr.length - 1)];
}

function random_color() {
  return random_element([
    "#e85821", "#2da4dc", "#87daa6"
  ]);
}

export function create_game() {
  const game = new Game({
    width: window.innerWidth,
    height: window.innerHeight,
    clear_color: "#eeeeee",
    far: 1000
  });

  const color = random_color();

  game.camera.keyboard_controlled = false;
  game.camera.mouse_controlled = false;
  game.camera.move_speed = 10;

  game.add(new Plane({
    material: basic,
    color,
    scale: [1000, 1, 1000]
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

  return game;
}

export function take_snapshot(game) {
  game.on("afterrender", function take() {
    game.off("afterrender", take);
    const snap = game.canvas.toDataURL();
    window.dispatch('SNAPSHOT_TAKEN', snap);
  });
}

export function create_level(game) {
  game.camera.position = [
    integer_between(-100, 100),
    1.5,
    integer_between(-20, 20)
  ];
}

export function start_level(game) {
  game.camera.position = [0, 1.5, 0];
  game.camera.keyboard_controlled = true;
  game.camera.mouse_controlled = true;

  for (const entity of game.entities) {
    entity.color = "#000000";
  }
}

export function end_level(game) {
  game.stop();
  // Compare the position and the orientation of the camera with the target.
  // Target can be an empty entity in the game.
  return Math.random();
}
