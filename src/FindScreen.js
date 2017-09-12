import html from "innerself";
import Scene from "./Scene";
import { connect } from "./store";

function FindScreen({hue, level}) {
  return Scene(
    {name: "SCENE_FIND", from: "black", to: "white"},
    // <div class="ui" style="background: hsl(${hue * 360}, 70%, 60%); ${"animation: fadeout 1s 1s forwards;"}"></div>
    html`
      <div class="ui action"
        onclick="dispatch('TRANSITION', 'START_LEVEL')">
        <div>Find this moment.</div>
      </div>`
  );
}

export default connect(FindScreen);
