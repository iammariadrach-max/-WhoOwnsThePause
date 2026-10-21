import { useEffect, useRef, type ReactNode } from "react";
import { useLongread } from "../state/LongreadContext";
export function SerifAccent({ children }: { children: ReactNode }) {
  return <em className="serif-accent">{children}</em>;
}
export function MixedTitle({
  text,
  accent,
}: {
  text: string;
  accent?: string;
}) {
  if (!accent || !text.includes(accent)) return <>{text}</>;
  const at = text.indexOf(accent);
  return (
    <>
      {text.slice(0, at)}
      <SerifAccent>{accent}</SerifAccent>
      {text.slice(at + accent.length)}
    </>
  );
}
export function AfterimageText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`afterimage-text ${className}`}>
      <span className="afterimage-copy afterimage-a" aria-hidden="true">
        {children}
      </span>
      <span className="afterimage-copy afterimage-b" aria-hidden="true">
        {children}
      </span>
      <span className="afterimage-original">{children}</span>
    </span>
  );
}
export function MicroLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`micro-label ${className}`} aria-hidden="true">
      {children}
    </span>
  );
}
export function Timecode({ animated = false }: { animated?: boolean }) {
  return (
    <span
      className={`timecode ${animated ? "timecode--expose" : ""}`}
      aria-hidden="true"
    >
      <span>
        {animated
          ? Array.from({ length: 11 }, (_, i) => (
              <i key={i}>00:00:{String(i).padStart(2, "0")}</i>
            ))
          : "00:00:10"}
      </span>
    </span>
  );
}
export function TimecodeRail({
  label,
  animated = false,
}: {
  label: string;
  animated?: boolean;
}) {
  return (
    <div className="timecode-rail" aria-hidden="true">
      <span>{label}</span>
      <i />
      <Timecode animated={animated} />
    </div>
  );
}
export function ScrambleLabel({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { state } = useLongread();
  useEffect(() => {
    const element = ref.current;
    const parent = element?.closest("button,a");
    if (!element || !parent || state.reducedMotion || state.pageMotionPaused)
      return;
    let frame = 0;
    const play = () => {
      cancelAnimationFrame(frame);
      const start = performance.now();
      const tick = (time: number) => {
        const progress = Math.min((time - start) / 240, 1);
        element.textContent = text
          .split("")
          .map((char, i) =>
            i / text.length < progress
              ? char
              : "01:+/"[(i + Math.floor(time / 40)) % 5],
          )
          .join("");
        if (progress < 1) frame = requestAnimationFrame(tick);
        else element.textContent = text;
      };
      frame = requestAnimationFrame(tick);
    };
    parent.addEventListener("pointerenter", play);
    return () => {
      cancelAnimationFrame(frame);
      element.textContent = text;
      parent.removeEventListener("pointerenter", play);
    };
  }, [text, state.reducedMotion, state.pageMotionPaused]);
  return (
    <span className="scramble-label">
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
