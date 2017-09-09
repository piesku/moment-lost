import * as random from "./random";

const context = new AudioContext();
const volume = 1;
const notes = {
  "a": 440,
  "c": 523.251,
  "d": 587.33,
  "e": 659.255,
  "g": 783.991,
};

function impulse(duration, decay) {
  const length = context.sampleRate	* duration;
  const impulse = context.createBuffer(2, length, context.sampleRate);
  const impulseL = impulse.getChannelData(0);
  const impulseR = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    // Generate white-noise for the echo.  It doesn't need to be generated with
    // our seeded RNG.
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  }

  return impulse;

}

// Soften the high tones.
const biquad_filter = context.createBiquadFilter();
biquad_filter.type = "lowpass";
biquad_filter.frequency.value = 200;
biquad_filter.Q.value = 10;

const reverb = context.createConvolver();
reverb.buffer = impulse(10, 10);

biquad_filter.connect(reverb);
reverb.connect(context.destination);

function play(freq) {
  const osc = context.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;

  const envelope = context.createGain();
  envelope.gain.setTargetAtTime(volume, context.currentTime, .1);
  envelope.gain.setTargetAtTime(0, context.currentTime + 1, .1);

  osc.connect(envelope);
  envelope.connect(biquad_filter);

  osc.start();
  osc.stop(context.currentTime + 10);
};

export function play_music() {
   const note = random.element_of(Object.values(notes));
   play(note);
   setTimeout(play_music, 2000 + random.integer(0, 10000));
}
