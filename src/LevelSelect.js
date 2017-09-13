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
  const total = results.reduce((acc, cur) => acc + cur);
  const average = Math.floor(total / results.length);
  // An inverted hyperbola with lim(x → ∞) = 1.
  const threshold = 100 * (1 - 2.5 / results.length);

  return Scene(
    {id: SCENES.LEVELS, from: "black", to: "black"},
    html`
      <div class="ui black">
        <div class="pad">
          ${results.map(LevelScore)}
          ${ average > threshold
            ? `<div class="action" style="padding: .5rem;"
                onclick="goto(${SCENES.FIND}, ${results.length})">next</div>`
            : `<div class="action" style="padding: .5rem;"
                title="Collect more accurate moments before advancing.">
                …?
               </div>`
           }
        </div>
      </div>`
  );
}

export default connect(LevelSelect);
