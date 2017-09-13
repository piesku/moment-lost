import html from "innerself";
import { connect } from "./store";

function Scene({next_scene}, {id, from, to}, ...children) {
  return html`
    ${children}
    ${next_scene !== null ? (next_scene === id
      ? `<div class="ui fadeout ${from}"></div>`
      : `<div class="ui fadein ${to}"></div>`
    ) : null}`;
}

export default connect(Scene);
