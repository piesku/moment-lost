import { create_level, start_level, end_level } from "./game";
import { play_music } from "./audio";
import { merge } from "./util";

const init = {
  level: null,
  hue: 0,
  target: null,
  results: [],
};

export default function reducer(state = init, action, args) {
  switch (action) {
    case "INIT": {
      play_music();
      return state;
    }
    case "GOTO_SCENE_FIND": {
      const [index] = args;
      const [level, hue] = create_level(index + 1);
      return merge(state, { index, level, hue });
    }
    case "SNAPSHOT_TAKEN": {
      const [target] = args;
      return merge(state, { target });
    }
    case "GOTO_SCENE_PLAY": {
      const { level, hue, target } = state;
      // level.canvas.requestPointerLock();
      start_level(level, hue, target);
      return state;
    }
    case "TAKE_SNAPSHOT": {
      const { level, index, target, results } = state;
      const score = end_level(level, target);
      return merge(state, {
        results: [
            ...results.slice(0, index),
            score,
            ...results.slice(index + 1)
        ]
      });
    }
    case "GOTO_SCENE_LEVELS":
      return merge(state, { level: null });
    default:
      return Object.assign({}, init, state);
  }
}
