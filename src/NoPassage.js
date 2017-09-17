import html from "innerself";
import Scene from "./Scene";
import { SCENES } from "./actions"

export default function NoPassage() {
  return Scene(
    {id: SCENES.NOPASS, from: "#111", to: "#111"},
    html`
      <div class="ui action"
        onclick="goto(${SCENES.LEVELS})">
        <div class="pad">
          The path onward is never easy.
          Collect more accurate moments before venturing forth.
        </div>
      </div>`
  );
}
