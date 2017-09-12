import html from "innerself";
import Scene from "./Scene";
import { connect } from "./store";

function ScoreScreen({results, index, target}) {
  return Scene(
    {name: "SCENE_SCORE", from: "white", to: "black"},
    html`
      <img class="ui"
        style="opacity: .5"
        src="${target.snapshot}">
      <div class="ui action"
        onclick="goto('SCENE_LEVELS')">
        <div class="pad">${results[index]}/100</div>
      </div>`
  );
}

export default connect(ScoreScreen);
