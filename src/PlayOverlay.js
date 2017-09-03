import html from "./inny";

export default function PlayOverlay() {
  return html`
    <div class="ui"
      onclick="dispatch('VALIDATE_SNAPSHOT')"></div>
  `;
}
