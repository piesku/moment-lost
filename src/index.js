import { Game } from 'cervus/modules/core'; 
import { Plane, Box } from 'cervus/modules/shapes';
import { basic } from 'cervus/modules/materials';

const game = new Game({
  width: window.innerWidth,
  height: window.innerHeight,
  clear_color: "#eeeeee",
  far: 1000
});

game.canvas.addEventListener(
  'click', () => game.canvas.requestPointerLock()
);

game.camera.position = [0, 1.5, 0];
game.camera.keyboard_controlled = true;
game.camera.mouse_controlled = true;

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
