import { useRef, type CSSProperties } from "react";
import { useLongread } from "../state/LongreadContext";
import { seconds } from "../hooks/timing";
import { copy } from "../content/longread";
import { PrimaryAction, SecondaryAction, SkipAction } from "./Actions";
import { SectionShell, goTo } from "./Shared";
import { SerifAccent } from "./EditorialType";
export function TimerExperience({
  variant = "first",
  externalResult = false,
}: {
  variant?: "first" | "second";
  externalResult?: boolean;
}) {
  const { state, dispatch } = useLongread();
  const timer = state.timers[variant];
  const first = state.timers.first.result;
  const action = useRef<HTMLButtonElement>(null);
  const event = (event: "start" | "stop" | "reset") =>
    dispatch({ type: "timer", key: variant, event, now: performance.now() });
  const next = variant === "first" ? "control-bridge" : "finale";
  return (
    <div className={`timer-experience is-${timer.status}`} data-timer={variant}>
      {timer.status !== "result" && (
        <p className="instruction">
          {timer.status === "idle"
            ? variant === "first"
              ? copy.timerInstruction
              : copy.finalTimerInstruction
            : copy.timerRunning}
        </p>
      )}
      <div
        className="timer-result"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {timer.status === "result" && (
          <>
            <p className="system-status">
              {variant === "first"
                ? "По вашему ощущению — 10 секунд."
                : first === null
                  ? "Вы не проходили первый опыт."
                  : `По таймеру в начале — ${seconds(first)} с.`}
            </p>
            <p className={`result-value${externalResult ? " sr-only" : ""}`}>
              <span className="sr-only">
                {variant === "first" ? "По таймеру — " : "Сейчас — "}
              </span>
              {seconds(timer.result!)}
              <span>с</span>
            </p>
            <p className="caption">
              {variant === "first"
                ? copy.timerDisclaimer
                : first === null
                  ? copy.timerDisclaimer
                  : copy.finalDisclaimer}
            </p>
          </>
        )}
      </div>
      <div className="actions">
        {timer.status !== "result" ? (
          <PrimaryAction
            ref={action}
            onClick={() => event(timer.status === "running" ? "stop" : "start")}
          >
            {timer.status === "running"
              ? "Остановить"
              : variant === "first"
                ? "Начать"
                : "Попробовать снова"}
          </PrimaryAction>
        ) : (
          <>
            <SecondaryAction onClick={() => event("reset")}>
              Повторить
            </SecondaryAction>
            <PrimaryAction
              onClick={() => {
                if (variant === "second")
                  dispatch({
                    type: "set",
                    key: "finaleStatus",
                    value: "revealed",
                  });
                if (variant === "first") goTo(next);
              }}
            >
              {variant === "first" ? "Читать дальше" : "Закончить"}
            </PrimaryAction>
          </>
        )}
        {timer.status !== "result" && variant === "second" && (
          <SkipAction
            onClick={() => {
              if (timer.status === "running") event("reset");
              dispatch({ type: "set", key: "finaleStatus", value: "revealed" });
            }}
          >
            Закончить
          </SkipAction>
        )}
      </div>
    </div>
  );
}
function PerceptionReadout() {
  const { state } = useLongread();
  const timer = state.timers.first;
  const hasResult = timer.status === "result" && timer.result !== null;
  const value = hasResult ? seconds(timer.result!) : "10";
  return (
    <div
      className={`perception-readout${hasResult ? " has-result" : ""}`}
      data-state={timer.status}
      data-result={hasResult ? value : undefined}
      aria-hidden="true"
      style={{ "--result-size": `${Math.min(64, 155 / value.length)}cqw` } as CSSProperties}
    >
      <div className="perception-readout-number">
        <span className="perception-readout-target">10</span>
        <span className="perception-readout-result">{hasResult ? value : ""}</span>
      </div>
      <span className="perception-readout-unit">{hasResult ? "ПО ТАЙМЕРУ / СЕКУНД" : "СЕКУНД"}</span>
    </div>
  );
}
export default function PerceptionTimer() {
  return (
    <SectionShell zone={2} className="light perception" title={false}>
      <div className="perception-layout">
        <div className="perception-copy">
          <h2 id="perception-title" className="section-title">
            Сколько длятся<br /><SerifAccent>десять</SerifAccent> секунд?
          </h2>
          <TimerExperience externalResult />
          <p className="caption after-note">{copy.timerAfter}</p>
        </div>
        <PerceptionReadout />
      </div>
    </SectionShell>
  );
}
