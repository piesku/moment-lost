import { create_game, create_level, start_level, end_level }
  from "./game";

const init = {
  current_scene: "SCENE_TITLE",
  current_game: null,
  target_snapshot: null,
  results: [],
};

function merge(...objs) {
  return Object.assign({}, ...objs);
}

export default function reducer(state = init, action, args) {
  switch (action) {
    case "PLAY_NOW":
    case "PLAY_LEVEL": {
      const current_game = create_game();
      create_level(current_game);
      return merge(state, {
        current_scene: "SCENE_FIND",
        current_game,
      });
    }
    case "SNAPSHOT_TAKEN": {
      const [target_snapshot] = args;
      return merge(state, {
        target_snapshot
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
      return merge(state, {
        current_scene: "SCENE_LEVELS",
        current_game: null
      });
    default:
      return state;
  }
}
