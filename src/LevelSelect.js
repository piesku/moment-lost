import html from "innerself";
import { connect } from "./store";

function LevelScore(score, idx) {
  const percent = Math.floor(score * 100);
  return html`
     <div class="box action"
       onclick="dispatch('PLAY_LEVEL', ${idx})"
       style="padding: .5rem">
       ${percent}%</div>
  `;
}

function LevelSelect({results}) {
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
        onclick="dispatch('PLAY_LEVEL', ${results.length})">next</div>
      </div>
    </div>
  `;
}

export default connect(LevelSelect);
