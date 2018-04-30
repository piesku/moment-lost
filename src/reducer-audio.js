import { context, play_music } from "./audio";
import * as actions from "./actions";
import { merge } from "./util";
import { dispatch } from "./store";

const init = {
  timeout: null,
  resuming: false,
};

export default function reducer(state = init, action) {
  switch (action) {
    case actions.AUDIO_RESUME: {
      const {timeout, resuming} = state;
      if (!resuming && !timeout) {
        context.resume().then(
          () => dispatch(actions.AUDIO_RESUMED));
      }
      return merge(state, {resuming: true});
    }
    case actions.AUDIO_RESUMED: {
      const timeout = play_music();
      return merge(state, {resuming: false, timeout});
    }
  }
}
