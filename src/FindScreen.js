import html from "innerself";
import Scene from "./Scene";
import { SCENE_FIND, SCENE_PLAY, TOGGLE_CLICKABLE, LOCK_POINTER }
  from "./actions"

function FindScreenAnimating(hue) {
  return html`
    <div class="ui"
      onanimationend="dispatch(${TOGGLE_CLICKABLE})"
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
      onclick="dispatch(${LOCK_POINTER}); goto(${SCENE_PLAY})">
      <div class="pad">Find this moment.</div>
    </div>`;
}

export default function FindScreen({hue, clickable}) {
  return Scene(
    {id: SCENE_FIND, from: "#000", to: "#fff"},
    clickable ? FindScreenClickable() : FindScreenAnimating(hue)
  );
}
