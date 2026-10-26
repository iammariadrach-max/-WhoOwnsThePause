import { useEffect, useRef } from "react";
import { useLongread } from "../state/LongreadContext";
import { advanceCover, coverShouldStop } from "../hooks/coverMotion";
import { createCoverRenderer, fragmentShader } from "../graphics/coverShader";

export default function CoverField({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const source = fragmentShader;
  const clock = useRef({ phase: 0, speed: 1 });
  const controls = useRef({ targetSpeed: 1, immediate: false, mode: "drifting" });
  const wake = useRef<() => void>(() => {});
  const { state: { reducedMotion, pageMotionPaused } } = useLongread();
  useEffect(() => {
    controls.current = {
      targetSpeed: coverShouldStop(paused, reducedMotion, pageMotionPaused) ? 0 : 1,
      immediate: reducedMotion || pageMotionPaused,
      mode: reducedMotion ? "reduced" : pageMotionPaused ? "page-paused" : paused ? "manual" : "drifting",
    };
    wake.current();
  }, [paused, reducedMotion, pageMotionPaused]);

  // Recompile only if shader source changes (including Vite HMR). Button presses
  // never recreate the scene, and the animation clock survives shader updates.
  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    let renderer = createCoverRenderer(canvas, source);
    canvas.dataset.renderer = renderer ? "webgl" : "unavailable";
    let frame = 0, last = 0, visible = false, lost = false;
    const draw = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || lost || !renderer) { last = 0; return; }
      const control = controls.current;
      if (control.immediate) clock.current.speed = 0;
      // Exclude background-tab time. No absolute elapsedTime × speed multiplication.
      clock.current = advanceCover(clock.current, last ? Math.min((now-last)/1000, 0.05) : 0, control.targetSpeed === 0);
      last = now;
      renderer.draw(clock.current.phase);
      canvas.dataset.speed = clock.current.speed.toFixed(3);
      canvas.dataset.phase = clock.current.phase.toFixed(4);
      canvas.dataset.targetSpeed = String(control.targetSpeed);
      canvas.dataset.motion = control.mode;
      if (clock.current.speed > 0 || control.targetSpeed > 0) frame = requestAnimationFrame(draw);
    };
    const schedule = () => {
      if (!frame && visible && !document.hidden && !lost) { last = 0; frame = requestAnimationFrame(draw); }
    };
    wake.current = schedule;
    const visibility = () => { cancelAnimationFrame(frame); frame = 0; last = 0; schedule(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; last = 0; }
      else schedule();
    });
    const resize = new ResizeObserver(schedule);
    const contextLost = (event: Event) => {
      event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; last = 0;
      canvas.dataset.renderer = "context-lost";
    };
    const contextRestored = () => {
      renderer?.dispose(); renderer = createCoverRenderer(canvas, source); lost = false;
      canvas.dataset.renderer = renderer ? "webgl" : "unavailable"; schedule();
    };
    observer.observe(hero); resize.observe(canvas);
    document.addEventListener("visibilitychange", visibility);
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);
    return () => {
      wake.current = () => {};
      observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      renderer?.dispose();
    };
  }, [source]);
  return <canvas ref={ref} id="cover-field" className="cover-field" aria-hidden="true" />;
}
