import html from "innerself";
import { connect } from "./store";

function ScoreScreen({results, index, target}) {
  const score = Math.floor(results[index] * 100);
  return html`
    <img class="ui"
      style="opacity: .5"
      src="${target.snapshot}">
    <div class="ui action"
      onclick="dispatch('PLAY_AGAIN')">
      <div>${score}/100</div>
    </div>
  `;
}

export default connect(ScoreScreen);
