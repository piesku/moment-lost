import html from "innerself";
import Scene from "./Scene";

export default function PlayOverlay() {
  return Scene(
    {name: "SCENE_PLAY", from: "white", to: "white"},
    html`<div class="ui"
      onclick="dispatch('VALIDATE_SNAPSHOT')"></div>`
  );
}
