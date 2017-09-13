import html from "innerself";
import Scene from "./Scene";
import { SCENES } from "./actions"

export default function NoPassage() {
  return Scene(
    {id: SCENES.NOPASS, from: "black", to: "black"},
    html`
      <div class="ui action black"
        onclick="goto(${SCENES.LEVELS})">
        <div class="pad">
          The path onward is never easy.
          Collect more accurate moments before venturing forth.
        </div>
      </div>`
  );
}
