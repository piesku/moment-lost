import { SCENES, ACTIONS } from "./actions";
import { merge } from "./util";

const init = {
  current_scene: SCENES.TITLE,
  next_scene: SCENES.TITLE,
}

export default function navigation(state = init, action, args) {
  switch (action) {
    case "T0": {
      const [next_scene, ...rest] = args;

      setTimeout(window['dispatch'], 1000, next_scene, ...rest)
      setTimeout(window['dispatch'], 2000, "T1");

      return merge(state, { next_scene });
    }
    case "T1": {
      return merge(state, { next_scene: null });
    }
    case ACTIONS.INIT: {
      setTimeout(window['dispatch'], 1000, "T1");
      return state;
    }
    case SCENES.INTRO:
    case SCENES.FIND:
    case SCENES.PLAY:
    case SCENES.SCORE:
    case SCENES.LEVELS:
    case SCENES.NOPASS: {
      const { next_scene } = state;
      return merge(state, { current_scene: next_scene });
    }
    default: {
      return state;
    }
  }
}
