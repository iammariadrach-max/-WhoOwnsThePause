import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useLongread } from "../state/LongreadContext";
import { registerScrollDriver } from "../hooks/scrollDriver";
export default function ReadingScroll() {
  const { state } = useLongread();
  useEffect(() => {
    const desktop = matchMedia(
      "(min-width: 701px) and (hover: hover) and (pointer: fine)",
    );
    let lenis: Lenis | undefined;
    const setup = () => {
      lenis?.destroy();
      lenis = undefined;
      registerScrollDriver(null);
      if (!desktop.matches || state.reducedMotion || state.pageMotionPaused)
        return;
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.18,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
        stopInertiaOnNavigate: true,
        prevent: (node) => !!node.closest("dialog"),
      });
      registerScrollDriver((element, smooth) =>
        lenis?.scrollTo(element, { immediate: !smooth, duration: 1.2 }),
      );
    };
    setup();
    desktop.addEventListener("change", setup);
    return () => {
      desktop.removeEventListener("change", setup);
      lenis?.destroy();
      registerScrollDriver(null);
    };
  }, [state.reducedMotion, state.pageMotionPaused]);
  return null;
}
