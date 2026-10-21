/** Monotonic inside a document; epoch origin also permits restoring a demo after reload. */
export const now = () => performance.timeOrigin + performance.now();
export const elapsed = (start: number, time: number) =>
  Math.max(0, time - start);
export const remaining = (start: number, duration: number, time: number) =>
  Math.max(0, duration - elapsed(start, time));
export const progress = (start: number, duration: number, time: number) =>
  Math.min(1, elapsed(start, time) / Math.max(1, duration));
export const seconds = (value: number) =>
  value.toLocaleString("ru-RU", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
export const countdown = (ms: number) =>
  `00:${String(Math.ceil(Math.max(0, ms) / 1000)).padStart(2, "0")}`;
