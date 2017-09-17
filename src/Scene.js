import html from "innerself";
import { TRANSITION } from "./actions";
import { connect } from "./store";

function Fadein(from_color, duration = 1) {
  return `<div class="ui"
    onanimationend="dispatch(${TRANSITION.END})"
    style="
      background-color: ${from_color};
      animation: fadein ${duration}s forwards reverse"></div>`;
}

function Fadeout(next, to_color, duration = 1) {
  return `<div class="ui"
    onanimationend="
      dispatch(${TRANSITION.CHANGE_SCENE});
      dispatch(${next.join(", ")})"
    style="
      background-color: ${to_color};
      animation: fadein ${duration}s forwards"></div>`;
}

function Scene({next}, {id, from, to, duration_in, duration_out}, ...children) {
  const [next_scene] = next;
  if (next_scene === null) {
    return children;
  }

  return html`
    ${children}
    ${next_scene === id
      ? Fadein(from, duration_in)
      : Fadeout(next, to, duration_out)}`;
}

export default connect(Scene);
