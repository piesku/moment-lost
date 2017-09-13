import html from "innerself";
import Scene from "./Scene";
import { SCENES } from "./actions"
import { connect } from "./store";

function IntroScreen({results}) {
  const onclick = results.length
    ? `goto(${SCENES.LEVELS})`
    : `goto(${SCENES.FIND}, 0)`;

  return Scene(
    {id: SCENES.INTRO, from: "black", to: "black"},
    html`
      <div class="ui action" onclick="${onclick}">
        <div class="pad" style="font-style: italic;">
          All those moments will be lost in time, like tears in rain.
        </div>
      </div>`
  );
}

export default connect(IntroScreen);
