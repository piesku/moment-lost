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

function Fadeout(to_color, next_scene, next_args) {
  return `<div class="ui"
    onanimationend="dispatch(${next_scene}, ${next_args.join(", ")})"
    style="
      background-color: ${to_color};
      animation: fadein 1s forwards"></div>`;
}

function Scene({next_scene, next_args}, {id, from, to}, ...children) {
  if (next_scene === null) {
    return children;
  }

  return html`
    ${children}
    ${next_scene === id ? Fadein(from) : Fadeout(to, next_scene, next_args)}`;
}

export default connect(Scene);
