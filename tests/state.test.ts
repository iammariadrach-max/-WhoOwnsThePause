import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, longreadReducer } from "../src/state/longreadReducer.ts";
import {
  elapsed,
  remaining,
  progress,
  countdown,
} from "../src/hooks/timing.ts";
test("perception uses elapsed milliseconds and restart clears the result", () => {
  let state = longreadReducer(initialState, {
    type: "timer",
    key: "first",
    event: "start",
    now: 100,
  });
  state = longreadReducer(state, {
    type: "timer",
    key: "first",
    event: "stop",
    now: 13500,
  });
  assert.equal(state.timers.first.result, 13.4);
  const ignored = longreadReducer(state, {
    type: "timer",
    key: "first",
    event: "stop",
    now: 20000,
  });
  assert.equal(ignored, state);
  state = longreadReducer(state, {
    type: "timer",
    key: "first",
    event: "reset",
    now: 0,
  });
  assert.deepEqual(state.timers.first, {
    status: "idle",
    result: null,
    startedAt: 0,
  });
});
test("mode changes do not restart work; cancellation rejects a late completion", () => {
  let state = longreadReducer(initialState, {
    type: "start",
    key: "secondary",
    now: 1000,
    duration: 20000,
  });
  state = longreadReducer(state, {
    type: "set",
    key: "secondaryWaitingMode",
    value: "reading",
  });
  assert.equal(state.processes.secondary.startedAt, 1000);
  state = longreadReducer(state, {
    type: "settle",
    key: "secondary",
    status: "cancelled",
    run: 1,
  });
  assert.equal(
    longreadReducer(state, {
      type: "settle",
      key: "secondary",
      status: "complete",
      run: 1,
    }),
    state,
  );
});
test("a stale run cannot complete a new process", () => {
  let state = longreadReducer(initialState, {
    type: "start",
    key: "background",
    now: 0,
    duration: 10000,
  });
  state = longreadReducer(state, {
    type: "start",
    key: "background",
    now: 4000,
    duration: 10000,
  });
  const next = longreadReducer(state, {
    type: "settle",
    key: "background",
    status: "complete",
    run: 1,
  });
  assert.equal(next.processes.background.status, "running");
  assert.equal(next.processes.background.startedAt, 4000);
});
test("all comparison variants use 10000 ms and an explicit intermission", () => {
  let state = longreadReducer(initialState, {
    type: "comparison",
    event: "start",
    now: 0,
  });
  for (let i = 0; i < 3; i++) {
    assert.equal(state.comparisonVariant, i);
    assert.equal(state.processes.comparison.duration, 10000);
    state = longreadReducer(state, {
      type: "settle",
      key: "comparison",
      status: "complete",
      run: i + 1,
    });
    assert.equal(state.comparisonStatus, i === 2 ? "survey" : "between");
    if (i < 2)
      state = longreadReducer(state, {
        type: "comparison",
        event: "next",
        now: (i + 1) * 12000,
      });
  }
});
test("skip stops comparison and does not fabricate an answer", () => {
  const running = longreadReducer(initialState, {
    type: "comparison",
    event: "start",
    now: 0,
  });
  const state = longreadReducer(running, {
    type: "comparison",
    event: "skip",
    now: 900,
  });
  assert.equal(state.comparisonStatus, "skipped");
  assert.equal(state.processes.comparison.status, "cancelled");
  assert.equal(state.comparisonClarityAnswer, null);
});
test("motion pause does not change any functional process", () => {
  const running = longreadReducer(initialState, {
    type: "start",
    key: "optional",
    now: 1000,
    duration: 10000,
  });
  const paused = longreadReducer(running, { type: "toggleMotion" });
  assert.equal(paused.processes, running.processes);
  assert.equal(paused.pageMotionPaused, true);
});
test("elapsed timing catches up after a throttled tab and clamps boundaries", () => {
  assert.equal(elapsed(1000, 51000), 50000);
  assert.equal(remaining(1000, 10000, 51000), 0);
  assert.equal(progress(1000, 10000, 51000), 1);
  assert.equal(remaining(1000, 10000, 6000), 5000);
  assert.equal(elapsed(1000, 900), 0);
  assert.equal(countdown(9999), "00:10");
  assert.equal(countdown(0), "00:00");
});
