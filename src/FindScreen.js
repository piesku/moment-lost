import html from "innerself";
import Scene from "./Scene";
import { SCENES, ACTIONS } from "./actions"
import { connect } from "./store";

function FindScreen({next_scene, hue}) {
  const style = next_scene === SCENES.PLAY
    ? null
    : `background: hsl(${hue * 360}, 70%, 60%); `
      + "animation: fadein 1s 1s forwards reverse";

  return Scene(
    {id: SCENES.FIND, from: "black", to: "white"},
    html`
      <div class="ui" style="${style}"></div>
      <div class="ui action"
        onclick="dispatch(${ACTIONS.LOCK_POINTER}); goto(${SCENES.PLAY})">
        <div class="pad">Find this moment.</div>
      </div>`
  );
}

export default connect(FindScreen);
