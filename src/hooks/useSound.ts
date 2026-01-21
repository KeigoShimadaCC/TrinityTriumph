import { useCallback, useRef } from "react";

export type SfxName = "select" | "hit" | "lose" | "parry" | "burst";

export const useSound = () => {
  const contextRef = useRef<AudioContext | null>(null);

  const ensureContext = () => {
    if (!contextRef.current) {
      contextRef.current = new AudioContext();
    }
    return contextRef.current;
  };

  const playTone = (
    ctx: AudioContext,
    frequency: number,
    duration: number,
    type: OscillatorType,
    gainValue = 0.12,
    when = 0
  ) => {
    const now = ctx.currentTime + when;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.05);
  };

  const play = useCallback((name: SfxName) => {
    const ctx = ensureContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    switch (name) {
      case "select":
        playTone(ctx, 420, 0.12, "square", 0.08);
        break;
      case "hit":
        playTone(ctx, 220, 0.18, "sawtooth", 0.12);
        playTone(ctx, 120, 0.14, "triangle", 0.1, 0.04);
        break;
      case "lose":
        playTone(ctx, 140, 0.22, "sawtooth", 0.14);
        playTone(ctx, 90, 0.2, "triangle", 0.1, 0.05);
        break;
      case "parry":
        playTone(ctx, 620, 0.08, "square", 0.08);
        playTone(ctx, 920, 0.1, "square", 0.05, 0.06);
        break;
      case "burst":
        playTone(ctx, 260, 0.2, "sawtooth", 0.15);
        playTone(ctx, 520, 0.16, "square", 0.12, 0.03);
        playTone(ctx, 840, 0.12, "triangle", 0.08, 0.06);
        break;
      default:
        break;
    }
  }, []);

  return play;
};
