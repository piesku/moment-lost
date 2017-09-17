import html from "innerself";
import Scene from "./Scene";
import { SCENE_INTRO, SCENE_LEVELS, SCENE_FIND } from "./actions"
import { connect } from "./store";

function IntroScreen({results}) {
  const onclick = results.length
    ? `goto(${SCENE_LEVELS})`
    : `goto(${SCENE_FIND}, 0)`;

  return Scene(
    {id: SCENE_INTRO, from: "#000", to: "#000"},
    html`
      <div class="ui action" onclick="${onclick}">
        <div class="pad">
          Collect your memories before they fade away.
        </div>
      </div>`
  );
}

export default connect(IntroScreen);
