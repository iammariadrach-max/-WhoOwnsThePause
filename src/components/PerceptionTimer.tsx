import { useRef } from "react";
import { useLongread } from "../state/LongreadContext";
import { seconds } from "../hooks/timing";
import { copy } from "../content/longread";
import { PrimaryAction, SecondaryAction, SkipAction } from "./Actions";
import { SectionShell, goTo } from "./Shared";
export function TimerExperience({
  variant = "first",
}: {
  variant?: "first" | "second";
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
            <p className="result-value">
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
        {timer.status !== "result" && (
          <SkipAction
            onClick={() => {
              if (timer.status === "running") event("reset");
              if (variant === "second")
                dispatch({
                  type: "set",
                  key: "finaleStatus",
                  value: "revealed",
                });
              if (variant === "first") goTo(next);
            }}
          >
            {variant === "first" ? "Пропустить опыт" : "Закончить"}
          </SkipAction>
        )}
      </div>
    </div>
  );
}
export default function PerceptionTimer() {
  return (
    <SectionShell zone={2} className="light perception">
      <div className="timer-layout">
        <span className="timer-index" aria-hidden="true">
          10<span>секунд</span>
        </span>
        <TimerExperience />
      </div>
      <p className="caption after-note">{copy.timerAfter}</p>
    </SectionShell>
  );
}
