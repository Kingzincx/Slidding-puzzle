/**
 * Beat Sync Module
 * Analyses audio in real-time using Web Audio API and pulses the user circle
 * to the beat, replicating the osu! logo pulsation effect.  ;D 
 */

const beatSync = {
  audioContext: null,
  analyser: null,
  mediaSource: null,
  animationId: null,
  initialized: false,

  // Audio analysis buffers
  frequencyData: null,
  floatFrequencyData: null,
  previousSpectrum: null,

  // Beat detection state
  fluxHistory: [],
  fluxHistoryMax: 43, // ~0.7s at 60fps
  lastBeatTime: 0,
  beatCooldown: 200, // ms minimum between beats

  // Animation state
  currentScale: 1.0,
  targetScale: 1.0,
  rippleActive: false,
  isAnimating: false,

  /**
   * Initialize the AudioContext and connect to the game music element.
   * Must be called after a user gesture (browser requirement).
   */
  init: function () {
    if (this.initialized) return;

    const music = document.getElementById("game-music");
    if (!music) return;

    try {
      this.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;

      // MediaElementSource can only be created once per element
      this.mediaSource = this.audioContext.createMediaElementSource(music);
      this.mediaSource.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.floatFrequencyData = new Float32Array(
        this.analyser.frequencyBinCount,
      );
      this.previousSpectrum = new Float32Array(this.analyser.frequencyBinCount);

      this.initialized = true;
    } catch (e) {
      console.warn("BeatSync: Could not initialize audio analysis", e);
    }
  },

  /**
   * Start the animation loop.
   */
  start: function () {
    if (!this.initialized || this.isAnimating) return;
    this.isAnimating = true;
    this.animate();
  },

  /**
   * Stop the animation loop.
   */
  stop: function () {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    // Reset circle scale
    const circle = document.getElementById("user-circle");
    if (circle) {
      circle.style.transform = "scale(1)";
    }
  },

  /**
   * Main animation loop using requestAnimationFrame.
   */
  animate: function () {
    if (!this.isAnimating) return;

    this.animationId = requestAnimationFrame(() => this.animate());

    if (!this.analyser || this.audioContext.state === "suspended") return;

    const circle = document.getElementById("user-circle");
    if (!circle) return;

    // Get frequency data
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getFloatFrequencyData(this.floatFrequencyData);

    // Calculate bass energy (bins 0-6, ~0-150Hz)
    let bassEnergy = 0;
    for (let i = 0; i < 7; i++) {
      bassEnergy += this.frequencyData[i];
    }
    bassEnergy = bassEnergy / (7 * 255); // Normalize to 0-1

    // Calculate spectral flux (sum of positive differences)
    let flux = 0;
    for (let i = 0; i < this.floatFrequencyData.length; i++) {
      const diff = this.floatFrequencyData[i] - this.previousSpectrum[i];
      if (diff > 0) {
        flux += diff;
      }
    }

    // Save current spectrum for next frame
    this.previousSpectrum.set(this.floatFrequencyData);

    // Update flux history
    this.fluxHistory.push(flux);
    if (this.fluxHistory.length > this.fluxHistoryMax) {
      this.fluxHistory.shift();
    }

    // Calculate average flux
    let avgFlux = 0;
    for (let i = 0; i < this.fluxHistory.length; i++) {
      avgFlux += this.fluxHistory[i];
    }
    avgFlux /= this.fluxHistory.length || 1;

    // Beat detection
    const now = performance.now();
    const isBeat =
      flux > avgFlux * 1.5 &&
      now - this.lastBeatTime > this.beatCooldown &&
      this.fluxHistory.length >= 10;

    if (isBeat) {
      this.lastBeatTime = now;
      const amplitudeAdjust = Math.min(bassEnergy + 0.3, 1.0);

      // Quick compression on beat impact (~60ms)
      this.targetScale = 1 - 0.03 * amplitudeAdjust;

      // Trigger ripple
      this.triggerRipple();

      // Schedule expansion back to normal (~500ms) with easeOutQuint
      setTimeout(() => {
        this.targetScale = 1.0;
      }, 60);
    }

    // Smooth breathing interpolation between beats (damping 0.9)
    const breathTarget = 1.0 - Math.max(0, bassEnergy - 0.3) * 0.04;
    if (this.targetScale === 1.0) {
      this.targetScale = breathTarget;
    }

    // Interpolate current scale towards target with damping
    this.currentScale += (this.targetScale - this.currentScale) * 0.1;

    // Apply transform
    circle.style.transform = `scale(${this.currentScale})`;
  },

  /**
   * Trigger a ripple effect on the circle.
   */
  triggerRipple: function () {
    const ripple = document.getElementById("user-circle-ripple");
    if (!ripple || this.rippleActive) return;

    this.rippleActive = true;
    ripple.style.opacity = "0.7";
    ripple.style.transform = "scale(1)";
    ripple.style.transition = "none";

    // Force reflow
    ripple.offsetHeight;

    ripple.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out";
    ripple.style.transform = "scale(1.4)";
    ripple.style.opacity = "0";

    setTimeout(() => {
      this.rippleActive = false;
      ripple.style.transition = "none";
      ripple.style.transform = "scale(1)";
    }, 500);
  },
};
