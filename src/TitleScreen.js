import html from "innerself";
import Scene from "./Scene";
import { SCENES } from "./actions"

export default function TitleScreen() {
  return Scene(
    {id: SCENES.TITLE, from: "black", to: "black"},
    html`
      <div class="ui action"
        onclick="goto(${SCENES.INTRO})">
        <div class="pad" style="margin: 1.3rem 0 1rem;">A moment lost in time.</div>
        <div style="font-size: 0.3rem; animation: fadein 1s 3s both">
          A story by <a href="https://piesku.com">piesku.com</a>.</div>
      </div>`
  );
}
