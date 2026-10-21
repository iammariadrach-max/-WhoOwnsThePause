import { useEffect, useRef } from "react";
import { useLongread } from "../state/LongreadContext";
import { advanceCover, coverShouldStop } from "../hooks/coverMotion";

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
    let frame = 0, last = 0, visible = false;
    const draw = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) { last = 0; return; }
      const stopped = coverShouldStop(paused, reducedMotion, pageMotionPaused);
      if (reducedMotion || pageMotionPaused) clock.current.speed = 0;
      clock.current = advanceCover(clock.current, last ? Math.min((now - last) / 1000, 0.1) : 0, stopped);
      last = now;
      const t = clock.current.phase;
      // Independent horizontal drift and stretch keep the light fluid without
      // moving the dot screen, grain or typography. Pointer movement is ignored.
      layers.forEach((layer, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        const x = direction * (Math.sin(t * (0.105 + i * 0.013)) * 2.3 + Math.sin(t * (0.071 + i * 0.006)) * 0.8);
        const y = Math.sin(t * (0.043 + i * 0.007)) * 0.25;
        const scale = 1 + Math.sin(t * (0.087 + i * 0.011)) * 0.055;
        const stretch = 1 + Math.sin(t * (0.063 + i * 0.009)) * 0.025;
        layer.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${scale}, ${stretch})`;
      });
      field.dataset.speed = clock.current.speed.toFixed(3);
      field.dataset.phase = t.toFixed(4);
      field.dataset.motion = reducedMotion ? "reduced" : pageMotionPaused ? "page-paused" : paused ? "manual" : "drifting";
      if (clock.current.speed > 0 || !stopped) frame = requestAnimationFrame(draw);
    };
    const wake = () => {
      if (!frame && visible && !document.hidden) { last = 0; frame = requestAnimationFrame(draw); }
    };
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
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [paused, reducedMotion, pageMotionPaused]);
  return <div ref={ref} id="cover-field" className="cover-field" aria-hidden="true"><i className="cover-wash" /><i className="cover-haze" /><i className="cover-edge" /><i className="cover-shadow" /><i className="cover-strip" /></div>;
}
