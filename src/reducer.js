import { create_level, start_level, end_level } from "./game";

const init = {
  current_scene: "SCENE_TITLE",
  current_level: null,
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
      const current_level = create_level();
      return merge(state, {
        current_scene: "SCENE_FIND",
        current_level,
      });
    }
    case "SNAPSHOT_TAKEN": {
      const [target] = args;
      return merge(state, { target });
    }
    case "START_LEVEL": {
      const { current_level } = state;
      // current_level.canvas.requestPointerLock();
      start_level(current_level);
      return merge(state, {
        current_scene: "SCENE_PLAY",
      });
    }
    case "VALIDATE_SNAPSHOT": {
      const { current_level, target, results } = state;
      const score = end_level(current_level, target);
      return merge(state, {
        current_scene: "SCENE_SCORE",
        results: [...results, score]
      });
    }
    case "PLAY_AGAIN":
      const { current_level } = state;
      return merge(state, {
        current_scene: "SCENE_LEVELS",
        current_level: null
      });
    default:
      return state;
  }
}
