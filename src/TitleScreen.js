import html from "innerself";
import Scene from "./Scene";
import { connect } from "./store";

function TitleScreen({results}) {
  const onclick = results.length
    ? "goto('SCENE_LEVELS')"
    : "goto('SCENE_FIND', 0)";

  return Scene(
    {name: "SCENE_TITLE", from: "black", to: "black"},
    html`
      <div class="ui action"
        onclick="${onclick}">
        <div>A moment lost in time.</div>
      </div>`
  );
}

export default connect(TitleScreen);
