import html from "innerself";
import Scene from "./Scene";
import { SCENE_TITLE, SCENE_INTRO, AUDIO_RESUME } from "./actions"

export default function TitleScreen() {
  return Scene(
    {id: SCENE_TITLE, from: "#000", to: "#000"},
    html`
      <div class="ui action"
        onclick="dispatch(${AUDIO_RESUME});goto(${SCENE_INTRO})">
        <div class="pad" style="margin: 1.3rem 0 1rem;">A moment lost in time.</div>
        <div style="font-size: 0.3rem; animation: fadein 1s 3s both">
          A story by <a href="https://piesku.com">piesku.com</a>.</div>
      </div>`
  );
}
