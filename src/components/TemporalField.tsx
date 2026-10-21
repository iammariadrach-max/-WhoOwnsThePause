import { useRef, type CSSProperties } from "react";
import { useInView } from "../hooks/useMotion";
import { useLongread } from "../state/LongreadContext";
import { OpticalGrid } from "./Atmosphere";
export default function TemporalField({ mode }: { mode: "intro" | "finale" }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, 0.01);
  const { state } = useLongread();
  const held = state.pageMotionPaused;
  return (
    <div
      ref={ref}
      className={`temporal-field temporal-field--${mode}`}
      data-mode={
        state.reducedMotion
          ? "reduced"
          : held
            ? "held"
            : !visible
              ? "paused"
              : mode
      }
      data-engine="temporal-exposure"
      aria-hidden="true"
    >
      {mode === "intro" ? (
        <>
          <div className="cover-monochrome" />
          <div className="cover-chromatic" />
          <svg className="cover-optics" viewBox="0 0 1440 900" fill="none">
            <circle cx="720" cy="425" r="350" />
            <circle cx="720" cy="425" r="530" />
            <circle cx="720" cy="425" r="700" />
            <path className="optical-axis" d="M720 0v900M0 425h1440" />
            <path
              className="optical-marks"
              d="M74 422v6m-3-3h6M1366 422v6m-3-3h6M717 66h6m-3-3v6M717 784h6m-3-3v6"
            />
          </svg>
        </>
      ) : (
        <>
          <div className="exposure-light exposure-light--cold" />
          <div className="exposure-light exposure-light--warm" />
          <div className="optical-smear" />
          <OpticalGrid />
          <div className="exposure-slices">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                className="exposure-slice"
                key={i}
                style={{ "--i": i } as CSSProperties}
              >
                <span>{String(i).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
          <div className="slit-scan-line" />
        </>
      )}
    </div>
  );
}
