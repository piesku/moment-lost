import html from "innerself";
import Scene from "./Scene";
import { SCENE_SCORE, SCENE_LEVELS } from "./actions"

export default function ScoreScreen({results, index, target}) {
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
    // Simulate a flash of light with a .1s fadeout to white in PlayOverlay and
    // a 1.9s fadein here.
    {id: SCENE_SCORE, from: "#fff", duration_in: 1.9, to: "#000"},
    html`
      <img class="ui"
        style="opacity: .5"
        src="${target.snapshot}">
      <div class="ui action"
        onclick="goto(${SCENE_LEVELS})">
        <div class="pad" style="margin: 1.5rem 0 1rem;">${message}</div>
        <div>${results[index]}</div>
      </div>`
  );
}
