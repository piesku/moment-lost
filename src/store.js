import { createStore } from "innerself";
// import with_logger from "innerself/logger";
import { INIT, TRANSITION_START } from "./actions";
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
const { attach, connect, dispatch } = createStore(reducer);
const goto = (...args) => dispatch(TRANSITION_START, ...args);

window.dispatch = dispatch;
window.goto = goto;
dispatch(INIT);

export { attach, connect, dispatch, goto };
