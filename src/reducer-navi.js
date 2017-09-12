import { merge } from "./util";

const init = {
  current_scene: "SCENE_TITLE",
  next_scene: "SCENE_TITLE",
}

const scenes = {
  INIT: "SCENE_TITLE",
  PLAY_LEVEL: "SCENE_FIND",
  START_LEVEL: "SCENE_PLAY",
  VALIDATE_SNAPSHOT: "SCENE_SCORE",
  PLAY_AGAIN: "SCENE_LEVELS",
};

export default function navigation(state = init, action, args) {
  switch (action) {
    case "TRANSITION": {
      const [next_action, ...rest] = args;
      const next_scene = scenes[next_action];

      setTimeout(dispatch, 1000, next_action, ...rest)
      setTimeout(dispatch, 2000, "TRANSITIONED");

      return Object.assign({}, state, {
        next_scene,
      });
    }
    case "TRANSITIONED": {
      return Object.assign({}, state, { next_scene: null });
    }
    case "INIT": {
      setTimeout(dispatch, 1000, "TRANSITIONED");
      return state;
    }
    case "PLAY_LEVEL":
    case "START_LEVEL":
    case "PLAY_AGAIN": {
      const { next_scene } = state;
      return Object.assign({}, state, {
        current_scene: next_scene
      });
    }
    case "VALIDATE_SNAPSHOT":
      return Object.assign({}, state, {
        current_scene: "SCENE_SCORE"
      });
    default: {
      return state;
    }
  }
}
