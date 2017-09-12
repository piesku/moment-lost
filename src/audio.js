// Audio doesn't use the seeded RNG from ./random because we don't know how
// much time the user is playing and how many notes will play.

function integer(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function element_of(arr) {
  return arr[integer(0, arr.length - 1)];
}

const context = new AudioContext();

// https://en.wikipedia.org/wiki/Piano_key_frequencies
const notes = [
  // The "A" harmonic minor scale.
  220,       // A3
  246.942,   // B
  261.626,   // C
  293.665,   // D
  329.628,   // E
  349.228,   // F
  //391.995, // G
  415.305,   // G#
  440        // A4

  // The "A" minor pentatonic scale.
  // 440,       // A4
  // 523.251,   // C
  // 587.33,    // D
  // 659.255,   // E
  // 783.991,   // G

];

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
biquad_filter.frequency.value = 100;
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
  const note = element_of(notes);
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

function fm_synth(audio_context, carrier, modulator, mod_gain) {
  this.modulator_gain = audio_context.createGain();
  this.modulator_gain.gain.value = mod_gain || 300;

  modulator.connect(this.modulator_gain);
  this.modulator_gain.connect(carrier.frequency);

  this.connect = audio_node => {
    carrier.disconnect();
    carrier.connect(audio_node);
  };

  this.disconnect = audio_node => {
    carrier.disconnect(audio_node);
  };
}

function am_synth(audio_context, node1, node2) {

  var am_gain = audio_context.createGain();
  am_gain.gain.value = 1;

  node1.connect(am_gain);
  node2.connect(am_gain.gain);

  this.connect = function(audio_node){
    am_gain.disconnect();
    am_gain.connect(audio_node);
  };
}

function param_ead(audio_context, param, attack_time, decay_time, min, max) {

  /* 0.001 - 60dB Drop
  e(-n) = 0.001; - Decay Rate of setTargetAtTime.
  n = 6.90776;
  */
  var t60multiplier = 6.90776;

  this.attack_time = attack_time || 0.9;
  this.decay_time = decay_time || 0.9;

  this.min = min || 0;
  this.max = max || 1;

  this.trigger = time => {
    var start_time = time || audio_context.currentTime;
    param.cancelScheduledValues(start_time);
    param.setValueAtTime(this.min, start_time);
    param.setTargetAtTime(this.max, start_time, this.attack_time/t60multiplier);
    param.setTargetAtTime(this.min, start_time + this.attack_time+(1.0/44100.0), this.decay_time/t60multiplier);
  };
}

const bird_sound_params = {
  "ifrq": 0.0204082,
  "atk": 0.367347,
  "dcy": 0.183673,
  "fmod1": 0.0612245,
  "atkf1": 0,
  "dcyf1": 1,
  "fmod2": 0.285714,
  "atkf2": 0.22449,
  "dcyf2": 0.489796,
  "amod1": 0.367347,
  "atka1": 0.387755,
  "dcya1": 0.734694,
  "amod2": 0.204082,
  "atka2": 0.428571,
  "dcya2": 0.142857
};

function bird_sound(position, time) {
  const freq_multiplier = 7000;
  const freq_offset = 300;
  const max_attack_decay_time = 0.9; //seconds
  const env_freq_multiplier = 3000;

  const panner = context.createPanner();
  panner.panningModel = "equalpower";
  panner.distanceModel = "exponential";
  panner.refDistance = 0.3;
  panner.setPosition(...position);

  const carrier_osc = context.createOscillator();
  const mod_osc = context.createOscillator();
  const am_osc = context.createOscillator();

  const mod_osc_gain = context.createGain();
  const am_osc_gain = context.createGain();

  const mainGain = context.createGain();

  mod_osc.connect(mod_osc_gain);
  am_osc.connect(am_osc_gain);

  const fm = new fm_synth(context, carrier_osc, mod_osc_gain);
  const am = new am_synth(context, fm, am_osc_gain);

  const main_env = new param_ead(context, mainGain.gain);
  const fm_freq_env = new param_ead(context, mod_osc.frequency);
  const am_freq_env = new param_ead(context, am_osc.frequency);
  const fm_gain_env = new param_ead(context,  mod_osc_gain.gain);
  const am_gain_env = new param_ead(context, am_osc_gain.gain);

  am.connect(mainGain);
  mainGain.connect(panner);
  panner.connect(context.destination);

  fm.modulator_gain.gain.value = freq_offset + freq_multiplier * bird_sound_params.ifrq;
  carrier_osc.frequency.value = freq_offset + freq_multiplier * bird_sound_params.ifrq;

  main_env.attack_time = max_attack_decay_time * bird_sound_params.atk;
  main_env.decay_time = max_attack_decay_time * bird_sound_params.dcy;

  fm_freq_env.max = env_freq_multiplier * bird_sound_params.fmod1;
  fm_freq_env.attack_time = max_attack_decay_time * bird_sound_params.atkf1;
  fm_freq_env.decay_time = max_attack_decay_time * bird_sound_params.dcyf1;

  am_freq_env.max = env_freq_multiplier * bird_sound_params.fmod2;
  am_freq_env.attack_time = max_attack_decay_time * bird_sound_params.atkf2;
  am_freq_env.decay_time = max_attack_decay_time * bird_sound_params.dcyf2;

  fm_gain_env.max = bird_sound_params.amod1;
  fm_gain_env.attack_time = max_attack_decay_time * bird_sound_params.atka1;
  fm_gain_env.decay_time = max_attack_decay_time * bird_sound_params.dcya1;

  am_gain_env.max = -bird_sound_params.amod2;
  am_gain_env.attack_time = max_attack_decay_time * bird_sound_params.atka2;
  am_gain_env.decay_time = max_attack_decay_time * bird_sound_params.dcya2;

  mainGain.gain.value = 0;
  carrier_osc.start(0);
  mod_osc.start(0);
  am_osc.start(0);

  main_env.trigger(time);
  fm_freq_env.trigger(time);
  am_freq_env.trigger(time);
  fm_gain_env.trigger(time);
  am_gain_env.trigger(time);
}

export function play_bird_sound(position) {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      bird_sound(position, context.currentTime + Math.random()*0.4);
    }, bird_sound_params.atk * 1000 * 1.2 * i);
  }
}
