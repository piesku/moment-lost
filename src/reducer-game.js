import { create_level, start_level, end_level } from "./game";
import { play_music } from "./audio";
import { merge } from "./util";

const init = {
  level: null,
  hue: 0,
  target: null,
  results: [],
};

export default function reducer(state = init, action, args) {
  switch (action) {
    case "INIT": {
      play_music();
      const saved_results = localStorage.getItem("results");
      const results = saved_results
        ? saved_results.split(" ").map(x => parseFloat(x))
        : [];
      return merge(state, { results });
    }
    case "GOTO_SCENE_FIND": {
      const [index] = args;
      const [level, hue] = create_level(index + 1);
      return merge(state, { index, level, hue });
    }
    case "SNAPSHOT_TAKEN": {
      const [target] = args;
      return merge(state, { target });
    }
    case "GOTO_SCENE_PLAY": {
      const { level, hue, target } = state;
      // level.canvas.requestPointerLock();
      start_level(level, hue, target);
      return state;
    }
    case "TAKE_SNAPSHOT": {
      const { level, index, target, results } = state;
      const score = end_level(level, target);
      const new_results = [
        ...results.slice(0, index),
        score,
        ...results.slice(index + 1)
      ];

      localStorage.setItem("results", new_results.join(" "));
      return merge(state, { results: new_results });
    }
    case "GOTO_SCENE_LEVELS":
      return merge(state, { level: null });
    default:
      return Object.assign({}, init, state);
  }
}
