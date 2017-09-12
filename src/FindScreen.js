import html from "innerself";
import { connect } from "./store";

function FindScreen({hue, level}) {
  if (!level) {
    setTimeout(window.dispatch, 1000, "CREATE_LEVEL");
  }

  return html`
    <div class="ui fadein action"
      style="background: hsl(${hue * 360}, 70%, 60%); ${level && "animation: fadeout 1s forwards;"}"
      onclick="dispatch('TRANSITION', 'START_LEVEL')">
      <div>Find this moment.</div>
    </div>
  `;
}

export default connect(FindScreen);
