import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceCover, coverShouldStop } from '../src/hooks/coverMotion.ts';
test('button braking reaches exact rest in 0.8 seconds, without resetting phase', () => {
  const half = advanceCover({phase: 42, speed: 1}, .4, true);
  assert.equal(half.speed, .5);
  assert.equal(half.phase, 42.3);
  const end = advanceCover(half, .4, true);
  assert.equal(end.speed, 0);
  assert.ok(Math.abs(end.phase - 42.4) < 1e-10);
  assert.deepEqual(advanceCover(end, 2, true), end);
});
test('resume continues from the frozen phase and takes 0.8 seconds', () => {
  const end = advanceCover({phase: 42.4, speed: 0}, .8, false);
  assert.equal(end.speed, 1);
  assert.ok(Math.abs(end.phase - 42.8) < 1e-10);
});
test('manual pause remains at rest for any duration until the button resumes it', () => {
  const stopped = advanceCover({phase: 23, speed: 1}, .8, true);
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
  for (let i = 0; i < 60; i++) fine = advanceCover(fine, 1/60, true);
  const coarse = advanceCover({phase: 0, speed: 1}, 1, true);
  assert.ok(Math.abs(fine.phase - coarse.phase) < 1e-10);
  assert.equal(fine.speed, coarse.speed);
});
