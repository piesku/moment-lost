import { create_store } from "innerself";
import with_logger from "innerself/logger";
import game from "./reducer";

const init = {
  timeout: null
}

function transitions(state = init, action, args) {
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

function chain(...reducers) {
  // return reducers.reduce(
  //   (acc, reducer) => (state, ...rest) => reducer(acc(state), ...rest)
  //   state => state
  // );
  return function(state, action, args) {
    return reducers.reduce(
      (acc, reducer) => reducer(acc, action, args), state
    );
  }
}

const reducer = with_logger(chain(transitions, game));
const { attach, connect, dispatch } =
  create_store(reducer);

dispatch("INIT");
window.dispatch = dispatch;
export { attach, connect };
