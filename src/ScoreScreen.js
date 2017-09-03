import html from "./inny";
import { connect } from "./store";

function ScoreScreen(score) {
  return html`
    <div class="ui" style="flex-flow:column nowrap; align-items:center;">
      <div>${Math.floor(score * 100)}%</div>

      <div class="action"
        style="margin-top:1rem; font-size:50%"
        onclick="dispatch('PLAY_NOW')">Fine.</div>
    </div>
  `;
}

export default connect(
  state => state.results[state.results.length - 1]
)(ScoreScreen);
