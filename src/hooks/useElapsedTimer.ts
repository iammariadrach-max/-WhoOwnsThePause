import { useEffect, useRef, useState } from "react";
import { now, progress, remaining } from "./timing";
import { useLongread } from "../state/LongreadContext";
import type { ProcessKey } from "../state/longreadReducer";
export function useElapsedTimer(key: ProcessKey, step = 100) {
  const { state } = useLongread();
  const process = state.processes[key];
  const [time, setTime] = useState(now);
  useEffect(() => {
    if (process.status !== "running") return;
    const update = () => setTime(now());
    const interval = setInterval(update, step);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, [process.status, process.startedAt, step]);
  const sampled = Math.max(process.startedAt, time);
  return {
    ...process,
    elapsed:
      process.status === "complete"
        ? process.duration
        : Math.max(0, sampled - process.startedAt),
    remaining:
      process.status === "complete"
        ? 0
        : remaining(process.startedAt, process.duration, sampled),
  };
}
/** Progress is painted directly; no React state updates on animation frames. */
export function useProgress(key: ProcessKey) {
  const ref = useRef<HTMLDivElement>(null);
  const { state } = useLongread();
  const process = state.processes[key];
  useEffect(() => {
    let frame = 0;
    let visible = true;
    const paint = () => {
      if (ref.current)
        ref.current.style.setProperty(
          "--progress",
          String(
            process.status === "idle"
              ? 0
              : process.status === "complete"
                ? 1
                : progress(process.startedAt, process.duration, now()),
          ),
        );
      if (process.status === "running" && visible && !document.hidden)
        frame = requestAnimationFrame(paint);
    };
    const wake = () => {
      cancelAnimationFrame(frame);
      paint();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    if (ref.current) observer.observe(ref.current);
    document.addEventListener("visibilitychange", wake);
    paint();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", wake);
    };
  }, [process]);
  return ref;
}
