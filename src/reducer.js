import { create_level, start_level, end_level } from "./game";
import * as random from "./random";

const init = {
  scene: "SCENE_TITLE",
  level: null,
  hue: 0,
  target: null,
  results: [],
};

function merge(...objs) {
  return Object.assign({}, ...objs);
}

export default function reducer(state = init, action, args) {
  switch (action) {
    case "PLAY_NOW":
    case "PLAY_LEVEL": {
      const hue = random.float(0, 1);
      const { results } = state;
      const level = create_level(results.length + 1, hue);
      return merge(state, {
        scene: "SCENE_FIND",
        level,
        hue
      });
    }
    case "SNAPSHOT_TAKEN": {
      const [target] = args;
      return merge(state, { target });
    }
    case "START_LEVEL": {
      const { level, hue, target } = state;
      // level.canvas.requestPointerLock();
      start_level(level, hue, target);
      return merge(state, {
        scene: "SCENE_PLAY",
      });
    }
    case "VALIDATE_SNAPSHOT": {
      const { level, target, results } = state;
      const score = end_level(level, target);
      return merge(state, {
        scene: "SCENE_SCORE",
        results: [...results, score]
      });
    }
    case "PLAY_AGAIN":
      return merge(state, {
        scene: "SCENE_LEVELS",
        level: null
      });
    default:
      return state;
  }
}
