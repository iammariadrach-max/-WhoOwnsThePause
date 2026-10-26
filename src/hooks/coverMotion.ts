// Time is accumulated, so stopping never resets the field's position.
export type CoverClock = { phase: number; speed: number };
export const BRAKE_SECONDS = 1.25;
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
/** Frame timestamps are milliseconds. Reset previous to null while hidden/idle.
 * Do not cap visible frame time: a slow GPU must still brake/resume in 1.25s. */
export function advanceCoverFrame(clock: CoverClock, previous: number | null, current: number, stopped: boolean): CoverClock {
  const delta = previous === null ? 0 : Math.max(0, current - previous) / 1000;
  return advanceCover(clock, delta, stopped);
}
export function coverShouldStop(manual: boolean, reduced: boolean, pagePaused: boolean) {
  return manual || reduced || pagePaused;
}
