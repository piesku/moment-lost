import html from "./inny";

export default function TitleScreen() {
  return html`
    <div class="ui" style="flex-flow:column nowrap; align-items:center;">
      <div>A moment lost in time.</div>

      <div class="action"
        style="margin-top:1rem; font-size:50%"
        onclick="dispatch('PLAY_NOW')">Play now.</div>
    </div>
  `;
}
