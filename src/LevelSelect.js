import html from "innerself";
import Scene from "./Scene";
import { SCENES } from "./actions"
import { connect } from "./store";

function LevelScore(score, idx) {
  return html`
     <div class="box action"
       onclick="goto(${SCENES.FIND}, ${idx})"
       style="padding: .5rem; color: #666;">
       ${score}</div>
  `;
}

function LevelSelect({results}) {
  return Scene(
    {id: SCENES.LEVELS, from: "black", to: "black"},
    html`
      <div class="ui black">
        <div class="pad">
          ${results.map(LevelScore)}
          <div class="action"
            style="padding: .5rem;"
            onclick="goto(${SCENES.FIND}, ${results.length})">next</div>
        </div>
      </div>`
  );
}

export default connect(LevelSelect);
