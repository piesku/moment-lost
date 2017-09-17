import { TRANSITION, SCENES } from "./actions";
import { merge } from "./util";

const init = {
  current_scene: SCENES.TITLE,
  next_scene: SCENES.TITLE,
  next_args: [],
}

export default function navigation(state = init, action, args) {
  switch (action) {
    case TRANSITION.START: {
      const [next_scene, ...next_args] = args;
      return merge(state, { next_scene, next_args });
    }
    case TRANSITION.END: {
      return merge(state, { next_scene: null, next_args: [] });
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
