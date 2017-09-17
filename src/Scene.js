import html from "innerself";
import { TRANSITION } from "./actions";
import { connect } from "./store";

function Fadein(from_color) {
  return `<div class="ui"
    onanimationend="dispatch(${TRANSITION.END})"
    style="
      background-color: ${from_color};
      animation: fadein 1s forwards reverse"></div>`;
}

function Fadeout(to_color, next) {
  return `<div class="ui"
    onanimationend="dispatch(${TRANSITION.CHANGE_SCENE}); dispatch(${next.join(", ")})"
    style="
      background-color: ${to_color};
      animation: fadein 1s forwards"></div>`;
}

function Scene({next}, {id, from, to}, ...children) {
  const [next_scene] = next;
  if (next_scene === null) {
    return children;
  }

  return html`
    ${children}
    ${next_scene === id ? Fadein(from) : Fadeout(to, next)}`;
}

export default connect(Scene);
