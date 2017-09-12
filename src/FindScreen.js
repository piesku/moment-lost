import html from "innerself";
import Scene from "./Scene";
import { connect } from "./store";

function FindScreen({next_scene, hue, level}) {
  const style = next_scene === "SCENE_PLAY"
    ? null
    : `background: hsl(${hue * 360}, 70%, 60%); `
      + "animation: fadein 1s 1s forwards reverse";

  return Scene(
    {name: "SCENE_FIND", from: "black", to: "white"},
    html`
      <div class="ui" style="${style}"></div>
      <div class="ui action"
        onclick="goto('SCENE_PLAY')">
        <div>Find this moment.</div>
      </div>`
  );
}

export default connect(FindScreen);
