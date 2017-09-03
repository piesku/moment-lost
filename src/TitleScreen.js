import html from "./inny";

export default function TitleScreen() {
  return html`
    <div class="ui action"
      onclick="dispatch('PLAY_NOW')">
      <div>A moment lost in time.</div>
    </div>
  `;
}
