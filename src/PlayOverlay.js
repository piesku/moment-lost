import html from "innerself";

export default function PlayOverlay() {
  return html`
    <div class="ui"
      onclick="dispatch('VALIDATE_SNAPSHOT')"></div>
  `;
}
