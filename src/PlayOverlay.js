import html from "innerself";
import Scene from "./Scene";
import { SCENE_PLAY, SCENE_SCORE, VALIDATE_SNAPSHOT } from "./actions"

export default function PlayOverlay({idle_reason}) {
  const message = idle_reason === "keydown"
    ? "Walk with the WASD keys."
    : "Move the mouse.";

  return Scene(
    // Simulate a flash of light with a .1s fadeout to white here and a 1.9s
    // fadein in ScoreScreen.
    {id: SCENE_PLAY, from: "#fff", to: "#fff", duration_out: .1},
    html`<div class="ui"
      onclick="dispatch(${VALIDATE_SNAPSHOT}); goto(${SCENE_SCORE})">
        ${ idle_reason &&
          `<div style="opacity: 0; animation: fadein 2s 1s alternate 2;">${message}</div>`
        }</div>`
  );
}
