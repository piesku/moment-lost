import html from "innerself";
import { connect } from "./store";

function Scene({next_scene}, {id, from, to, flash = false}, ...children) {
  return html`
    ${children}
    ${next_scene !== null ? (next_scene === id
      ? `<div class="ui fadeout ${from}"></div>`
      : `<div class="ui ${flash ? "flash" : "fadein"} ${to}"></div>`
    ) : null}`;
}

export default connect(Scene);
