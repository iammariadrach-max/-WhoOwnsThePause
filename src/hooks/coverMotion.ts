// Time is accumulated, so stopping never resets the field's position.
export type CoverClock = { phase: number; speed: number };
export const BRAKE_SECONDS = 0.8;
export const CURSOR_IDLE_MS = 1300;
export function advanceCover(clock: CoverClock, delta: number, stopped: boolean): CoverClock {
  const target = stopped ? 0 : 1;
  const duration = Math.abs(target - clock.speed) * BRAKE_SECONDS;
  const ramp = Math.min(Math.max(0, delta), duration);
  const speed = duration === 0 ? target : clock.speed + (target - clock.speed) * ramp / duration;
  return {
    speed,
    phase: clock.phase + ramp * (clock.speed + speed) / 2 + Math.max(0, delta - ramp) * target,
  };
}
export function coverShouldStop(manual: boolean, reduced: boolean, pagePaused: boolean, now: number, idleAt: number) {
  return manual || reduced || pagePaused || now < idleAt;
}
