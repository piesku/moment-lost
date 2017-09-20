import html from "innerself";
import Scene from "./Scene";
import { SCENE_LEVELS, SCENE_FIND, SCENE_NOPASS } from "./actions"

function LevelScore(score, idx) {
  return html`
     <div class="box action"
       onclick="goto(${SCENE_FIND}, ${idx})"
       style="color: rgba(255, 255, 255, 0.35);">
       ${score}</div>
  `;
}

export default function LevelSelect({results}) {
  // This block assumes results has at least one item. The IntroScreen ensures
  // the user doesn't get here without any results.
  const total = results.reduce((acc, cur) => acc + cur);
  const average = Math.floor(total / results.length);
  // An inverted hyperbola with lim(x → ∞) = 1. Levels 2 and 3 are always
  // available. Level 4 requires an average of 0.33. Level 5 requires an
  // average of 0.5, etc.
  const threshold = 100 * (1 - 2 / results.length);

  return Scene(
    {id: SCENE_LEVELS, from: "#000", to: "#000"},
    html`
      <div class="ui" style="background: #111">
        <div class="pad">
          ${results.map(LevelScore)}
          ${ average > threshold
            ? `<div class="box action"
                onclick="goto(${SCENE_FIND}, ${results.length})">next</div>`
            : `<div class="box action"
                onclick="goto(${SCENE_NOPASS})"
                title="Collect more accurate moments before advancing.">…?</div>`
           }
        </div>
      </div>`
  );
}
