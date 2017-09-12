import html from "innerself";
import Scene from "./Scene";

export default function TitleScreen() {
  return Scene(
    {name: "SCENE_TITLE", from: "black", to: "black"},
    html`
      <div class="ui action"
        onclick="dispatch('TRANSITION', 'PLAY_LEVEL', 0)">
        <div>A moment lost in time.</div>
      </div>`
  );
}
