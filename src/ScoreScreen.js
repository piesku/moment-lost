import html from "./inny";
import { connect } from "./store";

function ScoreScreen(score) {
  return html`
    <div class="ui action"
      onclick="dispatch('PLAY_AGAIN')">
      <div>${Math.floor(score * 100)}%</div>
    </div>
  `;
}

export default connect(
  state => state.results[state.results.length - 1]
)(ScoreScreen);
