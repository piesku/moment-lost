import html from "./inny";

export default function FindScreen() {
  return html`
    <div class="ui action"
      onclick="dispatch('START_LEVEL')">
      <div>Find this moment.</div>
    </div>
  `;
}
