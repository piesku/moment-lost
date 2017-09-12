import { create_store } from "innerself";
import with_logger from "innerself/logger";
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

const reducer = with_logger(chain(navigation_reducer, game_reducer));
const { attach, connect, dispatch } =
  create_store(reducer);

window.dispatch = dispatch;
window.goto = (...args) => dispatch("TRANSITION", ...args);
dispatch("INIT");
export { attach, connect };
