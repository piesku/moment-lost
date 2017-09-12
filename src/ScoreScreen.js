import html from "innerself";
import Scene from "./Scene";
import { connect } from "./store";

function ScoreScreen({results, index, target}) {
  const score = Math.floor(results[index] * 100);
  return Scene(
    {name: "SCENE_SCORE", from: "white", to: "black"},
    html`
      <img class="ui"
        style="opacity: .5"
        src="${target.snapshot}">
      <div class="ui action"
        onclick="dispatch('TRANSITION', 'PLAY_AGAIN')">
        <div>${score}/100</div>
      </div>`
  );
}

export default connect(ScoreScreen);
