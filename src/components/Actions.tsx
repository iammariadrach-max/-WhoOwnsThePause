import type { ComponentPropsWithRef } from "react";
type Props = ComponentPropsWithRef<"button">;
function Action({
  kind,
  className = "",
  children,
  ...props
}: Props & { kind: string }) {
  return (
    <button
      type="button"
      {...props}
      className={`action action--${kind} ${className}`}
    >
      {kind === "primary" && (
        <span className="action-index" aria-hidden="true">
          ↳
        </span>
      )}
      {children}
      <span aria-hidden="true">
        {kind === "primary"
          ? "↗"
          : kind === "pause"
            ? "Ⅱ"
            : kind === "destructive"
              ? "×"
              : "→"}
      </span>
    </button>
  );
}
export const PrimaryAction = (props: Props) => (
  <Action kind="primary" {...props} />
);
export const SecondaryAction = (props: Props) => (
  <Action kind="secondary" {...props} />
);
export const SkipAction = (props: Props) => <Action kind="skip" {...props} />;
export const DestructiveAction = (props: Props) => (
  <Action kind="destructive" {...props} />
);
export const PauseAction = (props: Props) => <Action kind="pause" {...props} />;
