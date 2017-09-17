import html from "innerself";
import Scene from "./Scene";
import { SCENE_NOPASS, SCENE_LEVELS } from "./actions"

export default function NoPassage() {
  return Scene(
    {id: SCENE_NOPASS, from: "#000", to: "#000"},
    html`
      <div class="ui action" style="background: #111"
        onclick="goto(${SCENE_LEVELS})">
        <div class="pad">
          The path onward is never easy.
          Collect more accurate moments before venturing forth.
        </div>
      </div>`
  );
}
