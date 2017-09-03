import { Game } from 'cervus/core';
import { Plane, Box } from 'cervus/shapes';
import { basic } from 'cervus/materials';

export function create_game() {
  const game = new Game({
    width: window.innerWidth,
    height: window.innerHeight,
    clear_color: "#eeeeee",
    far: 1000
  });

  game.camera.position = [0, 1.5, 0];
  game.camera.keyboard_controlled = true;
  game.camera.mouse_controlled = true;
  game.camera.move_speed = 10;

  game.add(new Plane({
    material: basic,
    color: "#000000",
    scale: [1000, 1, 1000]
  }));

  for (let i = 0; i < 20; i++) {
    const sign = Math.cos(i * Math.PI);
    const x = 75 + 100 * Math.sin(i * Math.PI / 6);
    game.add(new Box({
      material: basic,
      color: "#000000",
      position: [sign * x, 20, 20 * i],
      scale: [90, 40, 15]
    }));
  }

  return game;
}

