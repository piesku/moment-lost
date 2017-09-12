import html from "innerself";
import Scene from "./Scene";
import { connect } from "./store";

function LevelScore(score, idx) {
  const percent = Math.floor(score * 100);
  return html`
     <div class="box action"
       onclick="dispatch('TRANSITION', 'PLAY_LEVEL', ${idx})"
       style="padding: .5rem; color: #666;">
       ${percent}</div>
  `;
}

function LevelSelect({results}) {
  return Scene(
    {name: "SCENE_LEVELS", from: "black", to: "black"},
    html`
      <div class="ui black">
        <div style="
          display: flex;
          flex-wrap: wrap;
          max-width: 1280px;
          max-height: 720px">
        ${results.map(LevelScore)}
        <div class="action"
          style="padding: .5rem;"
          onclick="dispatch('TRANSITION', 'PLAY_LEVEL', ${results.length})">next</div>
        </div>
      </div>`
  );
}

export default connect(LevelSelect);
