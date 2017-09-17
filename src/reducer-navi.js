import * as actions from "./actions";
import { merge } from "./util";

const init = {
  current_scene: actions.SCENE_TITLE,
  // An array of the next scene's name and optional args.
  next: [actions.SCENE_TITLE],
}

export default function navigation(state = init, action, args) {
  switch (action) {
    case actions.TRANSITION_START: {
      return merge(state, { next: args  });
    }
    case actions.TRANSITION_END: {
      return merge(state, { next: [null]});
    }
    case actions.TRANSITION_CHANGE_SCENE: {
      const { next: [next_scene] } = state;
      return merge(state, { current_scene: next_scene });
    }
    default: {
      return state;
    }
  }
}
