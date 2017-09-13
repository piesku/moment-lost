import html from "innerself";
import Scene from "./Scene";
import { connect } from "./store";

function PlayOverlay({idle_reason}) {
  const message = idle_reason === "keydown"
    ? "Walk with the WASD keys."
    : "Move the mouse.";

  return Scene(
    {name: "SCENE_PLAY", from: "white", to: "white"},
    html`<div class="ui"
      onclick="dispatch('TAKE_SNAPSHOT'); goto('SCENE_SCORE')">
        ${ idle_reason &&
          `<div style="opacity: 0; animation: fadein 2s 1s alternate 2;">${message}</div>`
        }</div>`
  );
}

export default connect(PlayOverlay);
