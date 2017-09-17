import { createStore } from "innerself";
import { INIT, TRANSITION_START } from "./actions";
import nav from "./reducer-navi";
import game from "./reducer-game";

function combine(reducers) {
  return function(state = {}, action, args) {
    return Object.keys(reducers).reduce(
      (acc, name) => Object.assign(acc, {
        [name]: reducers[name](state[name], action, args),
      }),
      state
    );
  }
}

//import with_logger from "innerself/logger";
//const reducer = with_logger(combine({nav, game}));
const reducer = combine({nav, game});

const { attach, connect, dispatch } = createStore(reducer);
const goto = (...args) => dispatch(TRANSITION_START, ...args);

window.dispatch = dispatch;
window.goto = goto;
dispatch(INIT);

export { attach, connect, dispatch, goto };
