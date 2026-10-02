import { useEffect } from "react";
import { useReducedMotion } from "./useMotion";

/** Scroll changes the emphasis of a few sentences; text is always present and readable. */
export function useReadingMotion() {
  const reduced = useReducedMotion();
  useEffect(() => {
    const sentences = [
      ...document.querySelectorAll<HTMLElement>("[data-reading-reveal]"),
    ];
    if (reduced) {
      sentences.forEach((el) => el.style.setProperty("--reading", "1"));
      return;
    }
    let frame = 0;
    function paint() {
      const viewport = window.innerHeight;
      const readings = sentences.map((el) =>
        Math.max(
          0,
          Math.min(
            1,
            (viewport * 0.95 - el.getBoundingClientRect().top) /
              (viewport * 0.5),
          ),
        ),
      );
      sentences.forEach((el, i) =>
        el.style.setProperty("--reading", String(readings[i])),
      );
      frame = 0;
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);
}
