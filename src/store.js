import { create_store } from "./inny";
import { create_game } from "./game";

const default_state = {
  current_scene: "TITLE_SCREEN",
  current_game: null,
  results: [34, 45],
};

function merge(...objs) {
  return Object.assign({}, ...objs);
}

function reducer(state = default_state, action, args) {
  console.log(action);
  switch (action) {
    case "PLAY_NOW":
      return merge(state, {
        current_scene: "LEVEL_SELECT"
      });
    case "LEVEL_NEXT":
      const current_game = create_game();
      current_game.canvas.requestPointerLock();
      return merge(state, {
        current_scene: "LEVEL_PLAYING",
        current_game
      });

    default:
      return state;
  }
}

const { attach, connect, dispatch } = create_store(reducer);
window.dispatch = dispatch;

export { attach, connect, dispatch };
