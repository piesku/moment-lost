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
        <div style="margin: 1.3rem 0 1rem;">A moment lost in time.</div>
        <div style="font-size: 0.3rem; animation: fadein 1s 3s both">
          A story by <a href="https://piesku.com">piesku.com</a>.</div>
      </div>`
  );
}

export default connect(TitleScreen);
