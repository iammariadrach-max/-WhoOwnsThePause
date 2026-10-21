export function ExposureTransition({
  kind,
  label,
}: {
  kind: "negative" | "line" | "split" | "hold";
  label: string;
}) {
  return (
    <div
      data-motion-progress
      className={`exposure-transition transition--${kind}`}
      aria-hidden="true"
    >
      <span>{label}</span>
      <i />
      <b>+</b>
    </div>
  );
}
export function TypeSedimentTransition({ clear }: { clear: boolean }) {
  return (
    <div
      className={`sediment-threshold ${clear ? "is-clear" : ""}`}
      aria-hidden="true"
    >
      <span>09 / 10</span>
      <i />
      <span>{clear ? "HOLD" : "RELEASE"}</span>
    </div>
  );
}
