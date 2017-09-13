import html from "innerself";
import Scene from "./Scene";
import { SCENES, ACTIONS } from "./actions"
import { connect } from "./store";

function PlayOverlay({idle_reason}) {
  const message = idle_reason === "keydown"
    ? "Walk with the WASD keys."
    : "Move the mouse.";

  return Scene(
    {id: SCENES.PLAY, from: "white", to: "white", flash: true},
    html`<div class="ui"
      onclick="dispatch(${ACTIONS.VALIDATE_SNAPSHOT}); goto(${SCENES.SCORE})">
        ${ idle_reason &&
          `<div style="opacity: 0; animation: fadein 2s 1s alternate 2;">${message}</div>`
        }</div>`
  );
}

export default connect(PlayOverlay);
