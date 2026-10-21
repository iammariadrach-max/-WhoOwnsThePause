import { useEffect, useReducer, type ReactNode } from "react";
import {
  initialState,
  longreadReducer,
  type LongreadState,
  type Process,
  type ProcessKey,
} from "./longreadReducer";
import { now, remaining } from "../hooks/timing";
import { useReducedMotion } from "../hooks/useMotion";
import { LongreadStore as Context } from "./LongreadStore";
export { useLongread } from "./LongreadStore";
const storageKey = "pause-demo-file-v1";
function init(): LongreadState {
  try {
    const saved = JSON.parse(
      localStorage.getItem(storageKey) || "null",
    ) as Process | null;
    if (
      saved &&
      ["running", "complete"].includes(saved.status) &&
      Number.isFinite(saved.startedAt) &&
      saved.duration === 10000
    ) {
      const status =
        saved.status === "complete" ||
        remaining(saved.startedAt, saved.duration, now()) === 0
          ? "complete"
          : "running";
      return {
        ...initialState,
        processes: {
          ...initialState.processes,
          background: { ...saved, status },
        },
      };
    }
  } catch {
    /* Storage can be disabled in private browsing. The experience still works. */
  }
  return initialState;
}
export function LongreadProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(longreadReducer, undefined, init);
  const reduced = useReducedMotion();
  useEffect(() => {
    dispatch({ type: "set", key: "reducedMotion", value: reduced });
  }, [reduced]);
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const settle = () => {
      (Object.entries(state.processes) as [ProcessKey, Process][]).forEach(
        ([key, process]) => {
          if (
            process.status === "running" &&
            remaining(process.startedAt, process.duration, now()) === 0
          )
            dispatch({
              type: "settle",
              key,
              status: "complete",
              run: process.run,
            });
        },
      );
    };
    (Object.entries(state.processes) as [ProcessKey, Process][]).forEach(
      ([key, process]) => {
        if (process.status !== "running") return;
        const finish = () => {
          const left = remaining(process.startedAt, process.duration, now());
          // A browser may round a fractional timeout down. Never finish early.
          if (left > 0) timers.push(setTimeout(finish, Math.ceil(left)));
          else
            dispatch({
              type: "settle",
              key,
              status: "complete",
              run: process.run,
            });
        };
        timers.push(
          setTimeout(
            finish,
            Math.ceil(remaining(process.startedAt, process.duration, now())),
          ),
        );
      },
    );
    document.addEventListener("visibilitychange", settle);
    window.addEventListener("pageshow", settle);
    return () => {
      timers.forEach(clearTimeout);
      document.removeEventListener("visibilitychange", settle);
      window.removeEventListener("pageshow", settle);
    };
  }, [state.processes]);
  useEffect(() => {
    try {
      if (state.processes.background.status !== "idle")
        localStorage.setItem(
          storageKey,
          JSON.stringify(state.processes.background),
        );
    } catch {
      /* Optional persistence. */
    }
  }, [state.processes.background]);
  useEffect(() => {
    document.documentElement.dataset.motion =
      state.pageMotionPaused || state.reducedMotion ? "paused" : "active";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [state.pageMotionPaused, state.reducedMotion]);
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
}
