import { create_store } from "innerself";
import navigation_reducer from "./reducer-navi";
import game_reducer from "./reducer-game";

function chain(...reducers) {
  // return reducers.reduce(
  //   (acc, reducer) => (state, ...rest) => reducer(acc(state, ...rest), ...rest)
  //   state => state
  // );
  return function(state, action, args) {
    return reducers.reduce(
      (acc, reducer) => reducer(acc, action, args), state
    );
  }
}

const reducer = chain(navigation_reducer, game_reducer);
// const reducer = with_logger(chain(navigation_reducer, game_reducer));
const { attach, connect, dispatch } =
  create_store(reducer);

// Closure compiler's shit
window['dispatch'] = dispatch;
window['goto'] = (...args) => dispatch("TRANSITION", ...args);
dispatch("INIT");
export { attach, connect };
