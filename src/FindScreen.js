import html from "./inny";

export default function FindScreen() {
  return html`
    <div class="ui" style="flex-flow:column nowrap; align-items:center;">
      <div>Find this moment.</div>

      <div class="action"
        style="margin-top:1rem; font-size:50%"
        onclick="dispatch('START_LEVEL')">Ok.</div>
    </div>
  `;
}
