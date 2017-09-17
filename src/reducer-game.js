import { create_level, start_level, end_level } from "./game";
import { play_music } from "./audio";
import { setup_idle, clear_idle } from "./idle";
import * as actions from "./actions";
import { merge } from "./util";

const init = {
  level: null,
  hue: 0,
  target: null,
  results: [],
  clickable: true,
  idle_reason: null
};

export default function reducer(state = init, action, args) {
  switch (action) {
    case actions.INIT: {
      play_music();
      const saved_results = localStorage.getItem("results");
      const results = saved_results
        ? saved_results.split(" ").map(x => parseInt(x))
        : [];
      return merge(state, { results });
    }
    case actions.SCENE_FIND: {
      const [index] = args;
      const [level, hue] = create_level(index + 1);
      return merge(state, { index, level, hue, clickable: false });
    }
    case actions.TOGGLE_CLICKABLE: {
      const { clickable } = state;
      return merge(state, { clickable: !clickable });
    }
    case actions.SAVE_SNAPSHOT: {
      const [target] = args;
      return merge(state, { target });
    }
    case actions.LOCK_POINTER: {
      const { level } = state;
      level.canvas.requestPointerLock();
      return state;
    }
    case actions.SCENE_PLAY: {
      const { level, hue, target } = state;
      start_level(level, hue, target);
      level.canvas.addEventListener("click", oncanvasclick);
      setup_idle();
      return merge(state, { idle_reason: null });
    }
    case actions.WARN_IDLE: {
      const [idle_reason] = args;
      return merge(state, { idle_reason });
    }
    case actions.VALIDATE_SNAPSHOT: {
      const { level, index, target, results } = state;
      const score = end_level(level, target);
      const new_results = [
        ...results.slice(0, index),
        score,
        ...results.slice(index + 1)
      ];

      clear_idle();
      level.canvas.removeEventListener("click", oncanvasclick);
      document.exitPointerLock();
      localStorage.setItem("results", new_results.join(" "));
      return merge(state, { results: new_results });
    }
    case actions.SCENE_LEVELS:
      return merge(state, { level: null });
    default:
      return Object.assign({}, init, state);
  }

  function oncanvasclick() {
    window.dispatch(actions.VALIDATE_SNAPSHOT);
    window.goto(actions.SCENE_SCORE);
  }
}
