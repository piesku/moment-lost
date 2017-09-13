window.addEventListener("mousemove", reset_idle);
window.addEventListener("keydown", reset_idle);

const MAX_IDLE = 5000;
let last_active;
let last_reason;

export function reset_idle(event) {
  last_active = performance.now();
  last_reason = event ? event.type : "levelstart";
}

export function detect_idle() {
  if (last_active + MAX_IDLE < performance.now()) {
    window.dispatch("WARN_IDLE", last_reason);
    reset_idle();
  }
}
