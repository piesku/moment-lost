import { create_store } from "./inny";
import {
  create_game, generate_snapshot, start_level, end_level, destroy_level
} from "./game";

const default_state = {
  current_scene: "SCENE_TITLE",
  current_game: null,
  results: [],
};

function merge(...objs) {
  return Object.assign({}, ...objs);
}

function reducer(state = default_state, action, args) {
  switch (action) {
    case "PLAY_NOW":
    case "PLAY_LEVEL": {
      const current_game = create_game();
      generate_snapshot(current_game);
      return merge(state, {
        current_scene: "SCENE_FIND",
        current_game
      });
    }
    case "START_LEVEL": {
      const { current_game } = state;
      // current_game.canvas.requestPointerLock();
      start_level(current_game);
      return merge(state, {
        current_scene: "SCENE_PLAY",
      });
    }
    case "VALIDATE_SNAPSHOT": {
      const { current_game, results } = state;
      const score = end_level(current_game);
      return merge(state, {
        current_scene: "SCENE_SCORE",
        results: [...results, score]
      });
    }
    case "PLAY_AGAIN":
      const { current_game } = state;
      destroy_level(current_game);
      return merge(state, {
        current_scene: "SCENE_LEVELS",
        current_game: null
      });
    default:
      return state;
  }
}

const { attach, connect, dispatch } = create_store(reducer);
window.dispatch = dispatch;

export { attach, connect, dispatch };
