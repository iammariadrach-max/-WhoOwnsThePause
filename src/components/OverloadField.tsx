import { useEffect, useRef } from "react";
import { useLongread } from "../state/LongreadContext";
// Decorative glyphs only. The essay and all controls remain semantic DOM.
export default function OverloadField({ full }: { full: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { state } = useLongread();
  const reduced = state.reducedMotion;
  const paused = state.pageMotionPaused;
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    let frame = 0,
      visible = false,
      started = performance.now(),
      elapsed = 0;
    let width = 0,
      height = 0;
    const letters = "WAIT HOLD ETA NOW LATER 00:10 / + 01 09 99:99 . ";
    const noise = (n: number) => (Math.sin(n * 91.73 + 17.14) * 43758.54) % 1;
    const draw = (time: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      elapsed = time - started;
      const p =
        reduced || paused ? 1 : Math.min(elapsed / (full ? 3600 : 1600), 1);
      const settle = 1 - (1 - p) ** 3;
      context.clearRect(0, 0, width, height);
      const cell = width < 600 ? 13 : 14;
      const columns = Math.ceil(width / cell),
        rows = Math.ceil(height / 18);
      context.font = `${width < 600 ? 10 : 11}px "IBM Plex Mono", monospace`;
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < columns; col++) {
          const seed = row * columns + col;
          const hash = Math.abs(noise(seed));
          const ridge =
            0.42 + Math.sin(col * 0.19) * 0.09 + Math.cos(col * 0.07) * 0.12;
          const level = row / rows;
          if (level < ridge && hash > 0.025 + p * 0.09) continue;
          const x = col * cell;
          let y = row * 18 + 14;
          if (full) {
            y += (1 - settle) * (hash - 0.5) * 110;
          } else {
            y = y * (1 - settle) + (height - 28) * settle;
          }
          const alpha = full
            ? 0.35 + settle * 0.65
            : 1 - Math.max(0, (p - 0.42) / 0.58);
          context.globalAlpha = alpha;
          if (level > ridge) {
            context.fillStyle = "#343632";
            context.fillRect(x - 1, y - 13, cell + 2, 19);
            context.fillStyle = hash > 0.84 ? "#c4c4bb" : "#646660";
          } else context.fillStyle = "#85877e";
          context.fillText(letters[seed % letters.length], x, y);
        }
      context.globalAlpha = 1;
      if (!reduced && !paused && p < 1) frame = requestAnimationFrame(draw);
    };
    const schedule = () => {
      if (visible && !document.hidden && !frame)
        frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      const box = element.getBoundingClientRect();
      width = box.width;
      height = box.height;
      const dpr = Math.min(devicePixelRatio, 1.5);
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      schedule();
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        started = performance.now() - elapsed;
        schedule();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        started = performance.now() - elapsed;
        schedule();
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    intersection.observe(element);
    document.addEventListener("visibilitychange", visibility);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [full, reduced, paused]);
  return <canvas ref={canvas} className="type-sediment" aria-hidden="true" />;
}
