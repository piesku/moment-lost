import { merge } from "./util";

const init = {
  current_scene: "SCENE_TITLE",
  next_scene: "SCENE_TITLE",
}

export default function navigation(state = init, action, args) {
  switch (action) {
    case "TRANSITION": {
      const [next_scene, ...rest] = args;

      setTimeout(dispatch, 1000, "GOTO_" + next_scene, ...rest)
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
    case "GOTO_SCENE_FIND":
    case "GOTO_SCENE_PLAY":
    case "GOTO_SCENE_SCORE":
    case "GOTO_SCENE_LEVELS": {
      const { next_scene } = state;
      return Object.assign({}, state, {
        current_scene: next_scene
      });
    }
    default: {
      return state;
    }
  }
}
