import html from "innerself";
import Scene from "./Scene";
import { SCENES } from "./actions"
import { connect } from "./store";

function ScoreScreen({results, index, target}) {
  const score = results[index];
  const message = score < 15
    ? "Doesn't look like it."
    : score < 35
    ? "It was something else."
    : score < 50
    ? "It's not quite the same."
    : score < 75
    ? "Could it be?"
    : score < 85
    ? "It reminds you of something."
    : score < 95
    ? "That's it, almost there."
    : "Wonderful. You've found it.";

  return Scene(
    {id: SCENES.SCORE, from: "#fff", to: "#111"},
    html`
      <img class="ui"
        style="opacity: .5"
        src="${target.snapshot}">
      <div class="ui action"
        onclick="goto(${SCENES.LEVELS})">
        <div class="pad" style="margin: 1.5rem 0 1rem;">${message}</div>
        <div>${results[index]}</div>
      </div>`
  );
}

export default connect(ScoreScreen);
