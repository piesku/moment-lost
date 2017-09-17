import { TRANSITION, SCENES } from "./actions";
import { merge } from "./util";

const init = {
  current_scene: SCENES.TITLE,
  // An array of the next scene's name and optional args.
  next: [SCENES.TITLE],
}

export default function navigation(state = init, action, args) {
  switch (action) {
    case TRANSITION.START: {
      return merge(state, { next: args  });
    }
    case TRANSITION.END: {
      return merge(state, { next: [null]});
    }
    case TRANSITION.CHANGE_SCENE: {
      const { next: [next_scene] } = state;
      return merge(state, { current_scene: next_scene });
    }
    default: {
      return state;
    }
  }
}
