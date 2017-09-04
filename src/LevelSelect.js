import html from "./inny";
import { connect } from "./store";

function LevelScore(num) {
  return html`
     <div class="box"
       style="padding: .5rem">
       ${num}%</div>
  `;
}

function LevelSelect(results) {
  return html`
    <div class="ui"
      style="background-color: #000">
      <div style="
        display: flex;
        flex-wrap: wrap;
        max-width: 1280px;
        max-height: 720px">
      ${results.map(LevelScore)}
      <div class="action"
        style="padding: .5rem"
        onclick="dispatch('PLAY_LEVEL')">next</div>
      </div>
    </div>
  `;
}

export default connect(
  state => state.results.map(num => Math.floor(num * 100))
)(LevelSelect);
