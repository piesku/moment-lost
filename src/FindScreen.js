import html from "innerself";
import Scene from "./Scene";
import { SCENES, ACTIONS } from "./actions"
import { connect } from "./store";

function FindScreenAnimating(hue) {
  return html`
    <div class="ui"
      onanimationend="dispatch(${ACTIONS.TOGGLE_CLICKABLE})"
      style="
        background: hsl(${hue * 360}, 70%, 60%);
        animation: fadein 1s 1s forwards reverse;"></div>
    <div class="ui">
      <div class="pad">Find this moment.</div>
    </div>`;
}

function FindScreenClickable() {
  return html`
    <div class="ui action"
      onclick="dispatch(${ACTIONS.LOCK_POINTER}); goto(${SCENES.PLAY})">
      <div class="pad">Find this moment.</div>
    </div>`;
}

function FindScreen({hue, clickable}) {
  return Scene(
    {id: SCENES.FIND, from: "#111", to: "#fff"},
    clickable ? FindScreenClickable() : FindScreenAnimating(hue)
  );
}

export default connect(FindScreen);
