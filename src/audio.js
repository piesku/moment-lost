// Audio doesn't use the seeded RNG from ./random because we don't know how
// much time the user is playing and how many notes will play.

function integer(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function element_of(arr) {
  return arr[integer(0, arr.length - 1)];
}

const context = new AudioContext();
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

function play_note(freq) {
  const oscillator = context.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = freq;

  const envelope = context.createGain();
  envelope.gain.setTargetAtTime(1, context.currentTime, .1);
  envelope.gain.setTargetAtTime(0, context.currentTime + 1, .1);

  oscillator.connect(envelope);
  envelope.connect(biquad_filter);

  oscillator.start();
  oscillator.stop(context.currentTime + 10);
}

export function play_music() {
  const note = element_of(Object.values(notes));
  play_note(note);
  setTimeout(play_music, 2000 + integer(0, 10000));
}

export function play_footstep(freq = 50) {
  const oscillator = context.createOscillator();
  oscillator.frequency.value = freq;

  const base = context.createOscillator();
  base.frequency.value = freq - 20;

  const envelope = context.createGain();
  envelope.gain.value = 1.5;
  envelope.gain.setTargetAtTime(0, context.currentTime + .005, 0.01);

  base.connect(envelope);
  oscillator.connect(envelope);
  envelope.connect(context.destination);

  base.start();
  oscillator.start();

  const end_time = context.currentTime + 0.1;
  base.stop(end_time);
  oscillator.stop(end_time);
}
