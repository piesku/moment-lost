import html from "./inny";

export default function LevelScore(num) {
  return html`
    <div class="ui" style="flex-flow:column nowrap; align-items:center;">
      <div>A moment lost in time.</div>

      <div class="action"
        style="font-size:50%"
        onclick="dispatch('PLAY_NOW')">Play now.</div>
    </div>
  `;
}
