import { useLongread } from "../state/LongreadContext";
import { now, countdown } from "../hooks/timing";
import { useElapsedTimer } from "../hooks/useElapsedTimer";
import { copy } from "../content/longread";
import { PrimaryAction, SkipAction } from "./Actions";
import { Choice } from "./Shared";
import { sceneAttributes } from "../content/scenes";
export default function ControlPauseBridge() {
  const { state, dispatch } = useLongread();
  const timer = useElapsedTimer("bridge");
  const setStage = (value: typeof state.controlStage) =>
    dispatch({ type: "set", key: "controlStage", value });
  return (
    <aside
      id="control-bridge"
      tabIndex={-1}
      className="control-bridge dark scene-surface"
      {...sceneAttributes(2)}
      data-scene="control-bridge"
      aria-label="Переход от длительности к контролю"
    >
      <p className="meta">ДЛИТЕЛЬНОСТЬ → КОНТРОЛЬ</p>
      <p className="lead bridge-heading">{copy.bridge}</p>
      <div className="bridge-interaction">
        {state.controlStage === "choice" && (
          <>
            <p className="instruction">Продолжите, когда захотите.</p>
            <PrimaryAction
              onClick={() => {
                setStage("waiting");
                dispatch({
                  type: "start",
                  key: "bridge",
                  now: now(),
                  duration: 10000,
                });
              }}
            >
              Продолжить
            </PrimaryAction>
          </>
        )}
        {state.controlStage === "waiting" && (
          <>
            <p className="instruction">
              {timer.status === "complete"
                ? "Теперь можно продолжить."
                : "Продолжить можно через десять секунд."}
            </p>
            <span className="system-status bridge-clock" aria-hidden="true">
              {countdown(timer.remaining)}
            </span>
            <div className="actions">
              <PrimaryAction
                disabled={timer.status === "running"}
                onClick={() => setStage("question")}
              >
                Продолжить
              </PrimaryAction>
              <SkipAction
                onClick={() => {
                  dispatch({
                    type: "settle",
                    key: "bridge",
                    status: "cancelled",
                    run: timer.run,
                  });
                  setStage("question");
                }}
              >
                Пропустить демонстрацию
              </SkipAction>
            </div>
            <p className="sr-only" role="status">
              {timer.status === "complete"
                ? "Десять секунд прошли. Кнопка Продолжить доступна."
                : "Ожидание началось. Демонстрацию можно пропустить."}
            </p>
          </>
        )}
        {state.controlStage === "question" && (
          <>
            <Choice
              title={copy.bridgeQuestion}
              options={copy.bridgeChoices}
              value={state.controlPauseAnswer}
              onChange={(value) => {
                dispatch({ type: "set", key: "controlPauseAnswer", value });
                setStage("reflection");
              }}
            />
            <SkipAction onClick={() => setStage("reflection")}>
              Пропустить вопрос
            </SkipAction>
          </>
        )}
        {state.controlStage === "reflection" && (
          <p className="lead" role="status">
            {copy.bridgeEnd}
          </p>
        )}
      </div>
      <p className="caption bridge-caption">
        Момент окончания — тоже часть интерфейса.
      </p>
    </aside>
  );
}
