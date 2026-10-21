import { useEffect, useRef } from "react";
import { useLongread } from "../state/LongreadContext";
import { advanceCover, coverShouldStop, CURSOR_IDLE_MS } from "../hooks/coverMotion";

export default function CoverField({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const clock = useRef({ phase: 0, speed: 1 });
  const { state } = useLongread();
  const { reducedMotion, pageMotionPaused } = state;
  useEffect(() => {
    const field = ref.current;
    const hero = field?.parentElement;
    if (!field || !hero) return;
    const layers = [...field.querySelectorAll<HTMLElement>("i")];
    let frame = 0, last = 0, idleAt = 0, idleTimer = 0, visible = false;
    let pointer: [number, number] | null = null;
    const draw = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) { last = 0; return; }
      const stopped = coverShouldStop(paused, reducedMotion, pageMotionPaused, now, idleAt);
      if (reducedMotion || pageMotionPaused) clock.current.speed = 0;
      clock.current = advanceCover(clock.current, last ? Math.min((now - last) / 1000, 0.1) : 0, stopped);
      last = now;
      const t = clock.current.phase;
      // Independent, incommensurate frequencies: no shared visible loop or pointer parallax.
      layers.forEach((layer, i) => {
        const x = Math.sin(t * (0.026 + i * 0.009)) * (1.4 - i * 0.3) + Math.sin(t * 0.017) * 0.4;
        const y = Math.sin(t * (0.018 + i * 0.005)) * 0.35;
        const scale = 1 + Math.sin(t * (0.021 + i * 0.007)) * 0.025;
        layer.style.transform = `translate3d(${x}%, ${y}%, 0) scaleX(${scale})`;
      });
      field.dataset.speed = clock.current.speed.toFixed(3);
      field.dataset.phase = t.toFixed(4);
      field.dataset.motion = reducedMotion ? "reduced" : pageMotionPaused ? "page-paused" : paused ? "manual" : stopped ? "cursor" : "drifting";
      if (clock.current.speed > 0 || !stopped) frame = requestAnimationFrame(draw);
    };
    const wake = () => {
      if (!frame && visible && !document.hidden) { last = 0; frame = requestAnimationFrame(draw); }
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      if (pointer?.[0] === event.clientX && pointer?.[1] === event.clientY) return;
      pointer = [event.clientX, event.clientY];
      idleAt = performance.now() + CURSOR_IDLE_MS;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(wake, CURSOR_IDLE_MS + 1);
      wake();
    };
    const leave = () => { pointer = null; idleAt = 0; window.clearTimeout(idleTimer); wake(); };
    const visibility = () => {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      wake();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; last = 0; }
      else wake();
    });
    observer.observe(hero);
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame); window.clearTimeout(idleTimer);
      hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [paused, reducedMotion, pageMotionPaused]);
  return <div ref={ref} className="cover-field" aria-hidden="true"><i className="cover-haze" /><i className="cover-shadow" /><i className="cover-strip" /></div>;
}
