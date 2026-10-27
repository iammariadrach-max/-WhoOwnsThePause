import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceCover, advanceCoverFrame, coverShouldStop, BRAKE_SECONDS } from '../src/hooks/coverMotion.ts';
test('finishing a partial ramp reaches the exact target without floating-point overshoot', () => {
  for (const stopped of [true, false]) {
    for (const speed of [0.0035, 0.1, 0.3, 0.7, 0.9999]) {
      const end = advanceCover({phase: 42, speed}, 2, stopped);
      assert.equal(end.speed, stopped ? 0 : 1);
      if (stopped) assert.deepEqual(advanceCover(end, 2, true), end);
    }
  }
});
test('button braking reaches exact rest in 1.25 seconds, without resetting phase', () => {
  const half = advanceCover({phase: 42, speed: 1}, BRAKE_SECONDS/2, true);
  assert.equal(half.speed, .5);
  assert.equal(half.phase, 42 + BRAKE_SECONDS * .375);
  const end = advanceCover(half, BRAKE_SECONDS/2, true);
  assert.equal(end.speed, 0);
  assert.ok(Math.abs(end.phase - (42 + BRAKE_SECONDS/2)) < 1e-10);
  assert.deepEqual(advanceCover(end, 2, true), end);
});
test('resume continues from the frozen phase and takes 1.25 seconds', () => {
  const end = advanceCover({phase: 42 + BRAKE_SECONDS/2, speed: 0}, BRAKE_SECONDS, false);
  assert.equal(end.speed, 1);
  assert.ok(Math.abs(end.phase - (42 + BRAKE_SECONDS)) < 1e-10);
});
test('manual pause remains at rest for any duration until the button resumes it', () => {
  const stopped = advanceCover({phase: 23, speed: 1}, BRAKE_SECONDS, true);
  assert.deepEqual(advanceCover(stopped, 60, true), stopped);
  assert.equal(coverShouldStop(false, false, false), false);
  assert.ok(advanceCover(stopped, .4, false).phase > stopped.phase);
});
test('manual, reduced-motion and whole-page pause each stop the field', () => {
  assert.equal(coverShouldStop(true, false, false), true);
  assert.equal(coverShouldStop(false, true, false), true);
  assert.equal(coverShouldStop(false, false, true), true);
});
test('braking then changing direction has no speed or phase jump', () => {
  const slow = advanceCover({phase: 10, speed: 1}, .3, true);
  assert.deepEqual(advanceCover(slow, 0, false), slow);
  const resume = advanceCover(slow, .1, false);
  assert.ok(resume.speed > slow.speed && resume.speed < 1);
  assert.ok(resume.phase > slow.phase);
});
test('the same elapsed time gives the same phase at different frame rates', () => {
  let fine = {phase: 0, speed: 1};
  for (let i = 0; i < 120; i++) fine = advanceCover(fine, 1/60, true);
  const coarse = advanceCover({phase: 0, speed: 1}, 2, true);
  assert.ok(Math.abs(fine.phase - coarse.phase) < 1e-10);
  assert.equal(fine.speed, coarse.speed);
});
test('visible frame timestamps keep braking and resume on time at 4 fps', () => {
  for (const stopped of [true, false]) {
    const initial = {phase: 42, speed: stopped ? 1 : 0};
    let clock = advanceCoverFrame(initial, null, 0, stopped);
    for (let current = 250; current <= 1250; current += 250)
      clock = advanceCoverFrame(clock, current - 250, current, stopped);
    const expected = advanceCover(initial, BRAKE_SECONDS, stopped);
    assert.ok(Math.abs(clock.speed - expected.speed) < 1e-10);
    assert.ok(Math.abs(clock.phase - expected.phase) < 1e-10);
  }
});
test('returning from a hidden or idle scene does not advance its phase', () => {
  const frozen = {phase: 42, speed: 0};
  const returned = advanceCoverFrame(frozen, null, 60000, false);
  assert.deepEqual(returned, frozen);
  const nextFrame = advanceCoverFrame(returned, 60000, 61250, false);
  assert.equal(nextFrame.speed, 1);
  assert.equal(nextFrame.phase, 42 + BRAKE_SECONDS / 2);
});
