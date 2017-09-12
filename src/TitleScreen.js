import html from "innerself";

export default function TitleScreen() {
  return html`
    <div class="ui action"
      onclick="dispatch('PLAY_LEVEL', 0)">
      <div>A moment lost in time.</div>
    </div>
  `;
}
