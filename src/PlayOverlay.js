import html from "./inny";

export default function PlayOverlay() {
  return html`
    <div class="ui"
      style="width:100%; height:100%"
      onclick="dispatch('VALIDATE_SNAPSHOT')"></div>
  `;
}
