import ReflectionField from "./ReflectionField";
import { useLongread } from "../state/LongreadContext";
import { now } from "../hooks/timing";
import { useProgress } from "../hooks/useElapsedTimer";
import { copy } from "../content/longread";
import {
  PrimaryAction,
  SecondaryAction,
  SkipAction,
  DestructiveAction,
} from "./Actions";
import { SectionShell, Choice, goTo } from "./Shared";
export function LinearProgress({
  process,
}: {
  process: "comparison" | "secondary";
}) {
  const ref = useProgress(process);
  return (
    <div ref={ref} className="linear-progress" aria-hidden="true">
      <i />
    </div>
  );
}
function WaitingChoice() {
  const { state, dispatch } = useLongread();
  const process = state.processes.secondary;
  const modeKeys = ["indicator", "animation", "reading"] as const;
  return (
    <div id="waiting-choice" tabIndex={-1} className="waiting-choice reflection-scene" data-status={process.status}>
      <ReflectionField variant="choice" />
      <div className="waiting-story">
        <p className="lead">{copy.thirdQuestion}</p>
        <p className="instruction">
          Этот отдельный процесс длится около 20 секунд. Режим ожидания можно
          менять.
        </p>
        {process.status !== "running" && (
          <PrimaryAction
            onClick={() =>
              dispatch({
                type: "start",
                key: "secondary",
                now: now(),
                duration: 20000,
              })
            }
          >
            {process.status === "idle" ? "Запустить процесс" : "Запустить снова"}
          </PrimaryAction>
        )}
      </div>
      <div className="waiting-controls">
        <div className="waiting-modes" aria-label="Режим ожидания">
          {copy.waitingModes.map((label, i) => (
            <SecondaryAction
              key={label}
              aria-pressed={state.secondaryWaitingMode === modeKeys[i]}
              onClick={() => {
                dispatch({
                  type: "set",
                  key: "secondaryWaitingMode",
                  value: modeKeys[i],
                });
                if (i === 2) goTo("ninety-nine");
              }}
            >
              {label}
            </SecondaryAction>
          ))}
        </div>
        <div className="waiting-display">
          <p className="system-status waiting-status" role="status">
            {process.status === "complete"
              ? "Готово. Процесс завершён."
              : process.status === "cancelled"
                ? "Запрос отменён."
                : process.status === "running"
                  ? "Обрабатываем запрос"
                  : "Процесс ещё не запущен."}
          </p>
          {(process.status === "running" || process.status === "idle") &&
            (state.secondaryWaitingMode === "animation" ? (
              <div className="functional-orbit" aria-hidden="true">
                <i />
              </div>
            ) : state.secondaryWaitingMode === "indicator" ? (
              <LinearProgress process="secondary" />
            ) : (
              <p className="caption">
                Можно читать дальше. Результат появится в общем статусе.
              </p>
            ))}
        </div>
        {process.status === "running" && (
          <DestructiveAction
            onClick={() =>
              dispatch({
                type: "settle",
                key: "secondary",
                status: "cancelled",
                run: process.run,
              })
            }
          >
            Отменить запрос
          </DestructiveAction>
        )}
      </div>

    </div>
  );
}
export default function WaitingExperiment() {
  const { state, dispatch } = useLongread();
  const variant = ["А", "Б", "В"][state.comparisonVariant];
  const status = state.comparisonStatus;
  const ready = status === "survey" || status === "skipped";
  return (
    <SectionShell zone={5} className="dark comparison" image="attention" intro={<p className="body-large comparison-instruction">{copy.comparisonInstruction}</p>}>
      <div className="experiment-console">
        <ReflectionField variant="comparison" />
        <div
          className="comparison-stage"
          data-variant={status === "running" ? variant : status}
        >
          {status === "idle" && (
            <>
              <p className="lead">Время одно. Что меняет интерфейс?</p>
              <PrimaryAction
                onClick={() =>
                  dispatch({ type: "comparison", event: "start", now: now() })
                }
              >
                Начать сравнение
              </PrimaryAction>
            </>
          )}
          {(status === "running" || status === "between") && (
            <>
              <p className="meta" role="status">
                Вариант {state.comparisonVariant + 1} из 3 — {variant}
                {status === "between" ? " завершён." : ""}
              </p>
              {status === "running" ? (
                <>
                  <p className="lead">Обрабатываем запрос</p>
                  <div className="indicator-slot">
                    {state.comparisonVariant === 1 && (
                      <div className="spinner" aria-label="Процесс работает" />
                    )}
                    {state.comparisonVariant === 2 && (
                      <LinearProgress process="comparison" />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="caption">
                    Следующий вариант начнётся, когда вы будете готовы.
                  </p>
                  <PrimaryAction
                    onClick={() =>
                      dispatch({
                        type: "comparison",
                        event: "next",
                        now: now(),
                      })
                    }
                  >
                    Начать вариант{" "}
                    {["А", "Б", "В"][state.comparisonVariant + 1]}
                  </PrimaryAction>
                </>
              )}
            </>
          )}
          {status === "survey" && (
            <div className="comparison-survey">
              <Choice
                title={copy.durationQuestion}
                options={copy.durationChoices}
                value={state.comparisonDurationAnswer}
                onChange={(value) =>
                  dispatch({
                    type: "set",
                    key: "comparisonDurationAnswer",
                    value,
                  })
                }
              />
              <Choice
                title={copy.clarityQuestion}
                options={copy.clarityChoices}
                value={state.comparisonClarityAnswer}
                onChange={(value) =>
                  dispatch({
                    type: "set",
                    key: "comparisonClarityAnswer",
                    value,
                  })
                }
              />
              <p className="lead" role="status">
                {copy.comparisonEnd}
              </p>
              <SecondaryAction
                onClick={() =>
                  dispatch({ type: "comparison", event: "start", now: now() })
                }
              >
                Повторить сравнение
              </SecondaryAction>
            </div>
          )}
          {status === "skipped" && (
            <>
              <p className="lead">{copy.comparisonSkipped}</p>
              <SecondaryAction
                onClick={() =>
                  dispatch({ type: "comparison", event: "start", now: now() })
                }
              >
                Начать сравнение
              </SecondaryAction>
            </>
          )}
        </div>
        {!ready && (
          <SkipAction
            onClick={() =>
              dispatch({ type: "comparison", event: "skip", now: now() })
            }
          >
            Пропустить опыт
          </SkipAction>
        )}
      </div>
      <WaitingChoice />
    </SectionShell>
  );
}
