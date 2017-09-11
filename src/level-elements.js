import { Box, Sphere } from "cervus/shapes";
import { Transform, Render } from "cervus/components";
import { basic } from "cervus/materials";

import * as random from "./random";

export const element = (i, color, type) => {
  let elements = [];
  const sign_x = Math.cos(i * Math.PI);
  const sign_z = Math.cos(i * Math.PI);
  const x = 75 + 100 * Math.sin(i * Math.PI / 6);

  switch (type) {
    case 0:
    case 1:
      // building
      let buildings = random.integer(0, 2);

      while (buildings--) {
        const scale_y = random.integer(5, 80);
        const scale_x = random.integer(5, 80);
        const element = new Box();

        element.get_component(Render).set({
          material: basic,
          color,
        });
        element.get_component(Transform).set({
          position: [(sign_x * x) + scale_x, scale_y/2, sign_z * 20 * i],
          scale: [scale_x, scale_y, random.integer(5, 80)]
        });

        elements.push(element);
      }
      break;
    case 2:
      // tree
      const crown = new Sphere();
      const trunk = new Box();

      const trunk_scale_y = random.integer(12, 17);
      trunk.get_component(Transform).set({
        position: [sign_x * x, trunk_scale_y/2, sign_z * 20 * i],
        scale: [1, trunk_scale_y, 1]
      });
      trunk.get_component(Render).set({
        material: basic,
        color,
      });
      elements.push(trunk);

      const crown_scale = random.integer(2, 7);
      crown.get_component(Transform).set({
        position: [sign_x * x, trunk_scale_y, sign_z * 20 * i],
        scale: [crown_scale, crown_scale, crown_scale]
      });
      crown.get_component(Render).set({
        material: basic,
        color,
      });
      elements.push(crown);
      break;
    case 3:
      const spawner = new Box();
      spawner.get_component(Render).set({
        color: '#000000',
        material: basic
      });
      spawner.get_component(Transform).set({
        position: [0, 1, 0]
      });
      elements.push(spawner);
      break;
  }

  return elements;
}
