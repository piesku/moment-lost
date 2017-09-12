import html from "innerself";
import Scene from "./Scene";

export default function TitleScreen() {
  return Scene(
    {name: "SCENE_TITLE", from: "black", to: "black"},
    html`
      <div class="ui action"
        onclick="goto('SCENE_FIND', 0)">
        <div>A moment lost in time.</div>
      </div>`
  );
}
