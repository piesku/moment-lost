import html from "innerself";

export default function TitleScreen() {
  return html`
    <div class="ui fadein action"
      onclick="dispatch('TRANSITION', 'PLAY_LEVEL', 0)">
      <div>A moment lost in time.</div>
    </div>
  `;
}
