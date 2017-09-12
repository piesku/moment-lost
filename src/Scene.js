import html from "innerself";
import { connect } from "./store";

function Scene({next_scene}, {name, from, to}, ...children) {
  return html`
    ${children}
    ${next_scene && (next_scene === name
      ? `<div class="ui fadeout ${from}"></div>`
      : `<div class="ui fadein ${to}"></div>`
    )}`;
}

export default connect(Scene);
