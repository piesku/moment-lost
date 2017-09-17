import html from "innerself";
import Scene from "./Scene";
import { SCENES, ACTIONS } from "./actions"
import { connect } from "./store";

function PlayOverlay({idle_reason}) {
  const message = idle_reason === "keydown"
    ? "Walk with the WASD keys."
    : "Move the mouse.";

  return Scene(
    // Simulate a flash of light with a .1s fadeout to white here and a 1.9s
    // fadein in ScoreScreen.
    {id: SCENES.PLAY, from: "#fff", to: "#fff", duration_out: .1},
    html`<div class="ui"
      onclick="dispatch(${ACTIONS.VALIDATE_SNAPSHOT}); goto(${SCENES.SCORE})">
        ${ idle_reason &&
          `<div style="opacity: 0; animation: fadein 2s 1s alternate 2;">${message}</div>`
        }</div>`
  );
}

export default connect(PlayOverlay);
