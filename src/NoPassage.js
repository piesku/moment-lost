import html from "innerself";
import Scene from "./Scene";
import { SCENE_NOPASS, SCENE_LEVELS } from "./actions"

export default function NoPassage() {
  return Scene(
    {id: SCENE_NOPASS, from: "#111", to: "#111"},
    html`
      <div class="ui action"
        onclick="goto(${SCENE_LEVELS})">
        <div class="pad">
          The path onward is never easy.
          Collect more accurate moments before venturing forth.
        </div>
      </div>`
  );
}
