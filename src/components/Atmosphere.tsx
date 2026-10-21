import { useEffect } from "react";
import { useLongread } from "../state/LongreadContext";
export function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}
export function LightLeak() {
  return (
    <div className="light-leaks" aria-hidden="true">
      <i />
      <i />
    </div>
  );
}
export function VignetteLayer() {
  return <div className="vignette-layer" aria-hidden="true" />;
}
export function OpticalGrid() {
  return (
    <svg
      className="optical-grid"
      viewBox="0 0 1000 800"
      fill="none"
      aria-hidden="true"
    >
      <ellipse
        cx="700"
        cy="460"
        rx="440"
        ry="300"
        transform="rotate(-24 700 460)"
      />
      <ellipse
        cx="700"
        cy="460"
        rx="360"
        ry="245"
        transform="rotate(-24 700 460)"
        strokeDasharray="2 7"
      />
      <path d="M690 120v28m-14-14h28M260 590v20m-10-10h20M920 690v20m-10-10h20" />
    </svg>
  );
}
export function TemporalResidue({ word = "HOLD" }: { word?: string }) {
  return (
    <div className="temporal-residue" aria-hidden="true">
      <span>0 : / 1</span>
      <span>{word}</span>
      <span>+ — .</span>
    </div>
  );
}
export function SceneController() {
  const { state } = useLongread();
  const stopped = state.reducedMotion || state.pageMotionPaused;
  useEffect(() => {
    const root = document.documentElement;
    const surfaces = [
      ...document.querySelectorAll<HTMLElement>("[data-act][data-zone]"),
    ];
    const transitions = [
      ...document.querySelectorAll<HTMLElement>("[data-motion-progress]"),
    ];
    const nearby = new Set<HTMLElement>();
    let frame = 0,
      lastY = scrollY,
      trail = 0,
      active: HTMLElement | null = null;
    const measure = () => {
      frame = 0;
      if (document.hidden) return;
      let best: HTMLElement | null = null,
        distance = Infinity;
      const candidates = nearby.size ? nearby : surfaces;
      for (const node of candidates) {
        const rect = node.getBoundingClientRect();
        const d =
          rect.top <= innerHeight * 0.42 && rect.bottom > innerHeight * 0.42
            ? 0
            : Math.abs(rect.top - innerHeight * 0.42);
        if (d < distance) {
          best = node;
          distance = d;
        }
        if (!stopped)
          node.style.setProperty(
            "--scene-progress",
            String(
              Math.max(
                0,
                Math.min(
                  1,
                  (innerHeight - rect.top) / (innerHeight + rect.height),
                ),
              ),
            ),
          );
      }
      if (best && best !== active) {
        active = best;
        root.dataset.activeAct = best.dataset.act;
        root.dataset.activeScene = best.id;
        root.dataset.activeTone = best.dataset.tone;

      }
      if (!stopped)
        transitions.forEach((node) => {
          const r = node.getBoundingClientRect();
          if (r.top < innerHeight && r.bottom > 0)
            node.style.setProperty(
              "--transition-progress",
              String(
                Math.max(
                  0,
                  Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)),
                ),
              ),
            );
        });
      const delta = scrollY - lastY;
      lastY = scrollY;
      trail =
        stopped || active?.id === "optional-pause"
          ? 0
          : trail * 0.8 + Math.max(-12, Math.min(12, delta * 0.07));
      root.style.setProperty("--velocity-trail", `${trail.toFixed(2)}px`);
      if (Math.abs(trail) > 0.08) frame = requestAnimationFrame(measure);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.isIntersecting
            ? nearby.add(e.target as HTMLElement)
            : nearby.delete(e.target as HTMLElement),
        );
        schedule();
      },
      { rootMargin: "30% 0px 30% 0px" },
    );
    surfaces.forEach((node) => observer.observe(node));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    schedule();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [stopped]);
  useEffect(() => {
    document.documentElement.dataset.sediment = state.overloaded
      ? "full"
      : "clear";
  }, [state.overloaded]);
  return null;
}
export default function AtmosphereLayer() {
  return <><SceneController /><GrainOverlay /></>;
}
