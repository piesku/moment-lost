import { create_level, start_level, end_level } from "./game";

const init = {
  scene: "SCENE_TITLE",
  level: null,
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
      const level = create_level();
      return merge(state, {
        scene: "SCENE_FIND",
        level,
      });
    }
    case "SNAPSHOT_TAKEN": {
      const [target] = args;
      return merge(state, { target });
    }
    case "START_LEVEL": {
      const { level } = state;
      // level.canvas.requestPointerLock();
      start_level(level);
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
      const { level } = state;
      return merge(state, {
        scene: "SCENE_LEVELS",
        level: null
      });
    default:
      return state;
  }
}
