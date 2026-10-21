export type Phase = "idle" | "running" | "complete" | "cancelled";
export type ProcessKey =
  | "background"
  | "secondary"
  | "optional"
  | "bridge"
  | "comparison"
  | "ninetyNine"
  | "countdown";
export type Process = {
  status: Phase;
  startedAt: number;
  duration: number;
  run: number;
};
export type Timer = {
  status: "idle" | "running" | "result";
  startedAt: number;
  result: number | null;
};
export const emptyProcess: Process = {
  status: "idle",
  startedAt: 0,
  duration: 0,
  run: 0,
};
const emptyTimer: Timer = { status: "idle", startedAt: 0, result: null };
export type LongreadState = {
  timers: { first: Timer; second: Timer };
  processes: Record<ProcessKey, Process>;
  controlPauseAnswer: string | null;
  controlStage: "choice" | "waiting" | "question" | "reflection";
  comparisonVariant: number;
  comparisonStatus: "idle" | "running" | "between" | "survey" | "skipped";
  comparisonDurationAnswer: string | null;
  comparisonClarityAnswer: string | null;
  secondaryWaitingMode: "indicator" | "animation" | "reading";
  etaState: "initial" | "updated";
  overloaded: boolean;
  diagnostic: number;
  diagnosticCancelled: boolean;
  pageMotionPaused: boolean;
  pauseChosen: boolean;
  finaleStatus: "idle" | "revealed";
  reducedMotion: boolean;
  tocOpen: boolean;
};
export const initialState: LongreadState = {
  timers: { first: emptyTimer, second: emptyTimer },
  processes: Object.fromEntries(
    [
      "background",
      "secondary",
      "optional",
      "bridge",
      "comparison",
      "ninetyNine",
      "countdown",
    ].map((key) => [key, { ...emptyProcess }]),
  ) as Record<ProcessKey, Process>,
  controlPauseAnswer: null,
  controlStage: "choice",
  comparisonVariant: 0,
  comparisonStatus: "idle",
  comparisonDurationAnswer: null,
  comparisonClarityAnswer: null,
  secondaryWaitingMode: "indicator",
  etaState: "initial",
  overloaded: true,
  diagnostic: 0,
  diagnosticCancelled: false,
  pageMotionPaused: false,
  pauseChosen: false,
  finaleStatus: "idle",
  reducedMotion: false,
  tocOpen: false,
};
type SetAction = {
  [K in Exclude<keyof LongreadState, "timers" | "processes">]: {
    type: "set";
    key: K;
    value: LongreadState[K];
  };
}[Exclude<keyof LongreadState, "timers" | "processes">];
export type Action =
  | SetAction
  | {
      type: "timer";
      key: "first" | "second";
      event: "start" | "stop" | "reset";
      now: number;
    }
  | { type: "start"; key: ProcessKey; now: number; duration: number }
  | {
      type: "settle";
      key: ProcessKey;
      status: "complete" | "cancelled";
      run: number;
    }
  | { type: "comparison"; event: "start" | "next" | "skip"; now: number }
  | { type: "toggleMotion" };
export function longreadReducer(
  state: LongreadState,
  action: Action,
): LongreadState {
  switch (action.type) {
    case "set":
      return { ...state, [action.key]: action.value };
    case "timer": {
      const old = state.timers[action.key];
      if (action.event === "stop" && old.status !== "running") return state;
      const timer: Timer =
        action.event === "reset"
          ? { ...emptyTimer }
          : action.event === "start"
            ? { status: "running", startedAt: action.now, result: null }
            : {
                ...old,
                status: "result",
                result: Math.max(0, action.now - old.startedAt) / 1000,
              };
      return { ...state, timers: { ...state.timers, [action.key]: timer } };
    }
    case "start":
      return {
        ...state,
        processes: {
          ...state.processes,
          [action.key]: {
            status: "running",
            startedAt: action.now,
            duration: action.duration,
            run: state.processes[action.key].run + 1,
          },
        },
      };
    case "settle": {
      const process = state.processes[action.key];
      if (process.status !== "running" || process.run !== action.run)
        return state;
      const next = {
        ...state,
        processes: {
          ...state.processes,
          [action.key]: { ...process, status: action.status },
        },
      };
      if (action.key === "comparison" && action.status === "complete")
        next.comparisonStatus =
          state.comparisonVariant === 2 ? "survey" : "between";
      return next;
    }
    case "comparison": {
      if (action.event === "skip")
        return {
          ...state,
          comparisonStatus: "skipped",
          processes: {
            ...state.processes,
            comparison: { ...state.processes.comparison, status: "cancelled" },
          },
        };
      const variant =
        action.event === "start" ? 0 : Math.min(2, state.comparisonVariant + 1);
      return {
        ...state,
        comparisonVariant: variant,
        comparisonStatus: "running",
        ...(action.event === "start"
          ? { comparisonDurationAnswer: null, comparisonClarityAnswer: null }
          : {}),
        processes: {
          ...state.processes,
          comparison: {
            status: "running",
            startedAt: action.now,
            duration: 10000,
            run: state.processes.comparison.run + 1,
          },
        },
      };
    }
    case "toggleMotion":
      return {
        ...state,
        pageMotionPaused: !state.pageMotionPaused,
        pauseChosen: true,
      };
  }
}
