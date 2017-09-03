import html from "./inny";
import { connect } from "./store";

function ScoreScreen(score) {
  return html`
    <div class="ui action"
      onclick="dispatch('PLAY_AGAIN')">
      <div>${score}%</div>
    </div>
  `;
}

export default connect(
  state => Math.floor(state.results[state.results.length - 1] * 100)
)(ScoreScreen);
