import html from "innerself";
import Scene from "./Scene";
import { connect } from "./store";

function PlayOverlay({last_reason}) {
  const message = last_reason === "mousemove"
    ? "Walk with WASD keys."
    : "Move the mouse.";

  return Scene(
    {name: "SCENE_PLAY", from: "white", to: "white"},
    html`<div class="ui"
      onclick="dispatch('TAKE_SNAPSHOT'); goto('SCENE_SCORE')">
        ${ last_reason &&
          `<div style="animation: fadein 2s alternate 2 forwards;">${message}</div>`
        }</div>`
  );
}

export default connect(PlayOverlay);
