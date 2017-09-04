import html from "./inny";
import { connect } from "./store";

function ScoreScreen(props) {
  return html`
    <img class="ui"
      style="opacity: .5"
      src="${props.target_snapshot}">
    <div class="ui action"
      onclick="dispatch('PLAY_AGAIN')">
      <div>${props.score}%</div>
    </div>
  `;
}

function selector(state) {
  const { results, target_snapshot } = state;
  const score = Math.floor(results[results.length - 1]) * 100;
  return { score, target_snapshot };
}

export default connect(selector)(ScoreScreen);
