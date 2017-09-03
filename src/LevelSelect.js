import html from "./inny";
import { connect } from "./store";

function LevelScore(num) {
  return html`
     <div class="box">${Math.floor(num * 100)}%</div>
  `;
}

function LevelSelect(results) {
  return html`
    <div class="ui">
      ${results.map(LevelScore)}
      <div class="box action"
        onclick="dispatch('NEXT_LEVEL')">next</div>
    </div>
  `;
}

export default connect(state => state.results)(LevelSelect);
