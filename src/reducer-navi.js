import { merge } from "./util";

const init = {
  scene: "SCENE_TITLE",
  timeout: null
}

export default function navigation(state = init, action, args) {
  const { timeout } = state;
  switch (action) {
    case "TRANSITION": {
      if (timeout) {
        return state;
      }

      for (const ui of document.querySelectorAll(".ui")) {
        ui.classList.add("fadeout");
      }
      const [next_action, ...rest] = args;
      return Object.assign({}, state, {
        timeout: setTimeout(dispatch, 1000, next_action, ...rest)
      });
    }
    case "INIT": {
      return merge(state, { scene: "SCENE_TITLE" });
    }
    case "PLAY_LEVEL": {
      return merge(state, { scene: "SCENE_FIND" });
    }
    case "START_LEVEL": {
      return merge(state, { scene: "SCENE_PLAY" });
    }
    case "VALIDATE_SNAPSHOT": {
      return merge(state, { scene: "SCENE_SCORE" });
    }
    case "PLAY_AGAIN":
      return merge(state, { scene: "SCENE_LEVELS" });
    default: {
      if (timeout) {
        clearTimeout(timeout);
      }

      return Object.assign({}, state, {
        timeout: null
      });
    }
  }
}
