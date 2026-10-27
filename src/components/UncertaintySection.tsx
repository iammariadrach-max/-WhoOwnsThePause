import ReflectionField from "./ReflectionField";
import { useLongread } from "../state/LongreadContext";
import { now } from "../hooks/timing";
import { copy, chapters } from "../content/longread";
import { PrimaryAction, SecondaryAction } from "./Actions";
import { SectionShell, goTo } from "./Shared";
import IllustratedReading from "./IllustratedReading";
export default function UncertaintySection() {
  const { state, dispatch } = useLongread();
  const process = state.processes.background;
  const clear = process.status !== "idle";
  return (
    <SectionShell zone={4} className="light uncertainty" image="uncertainty" intro={<p className="lead">{chapters[3].body[0]}</p>}>
      <div className={`message-field ${clear ? "is-clear" : ""}`}>
        <ReflectionField variant="processing" />
        <div className="message-status" aria-live="polite" aria-atomic="true">
          <span className="meta">
            {clear ? "ЗАПРОС ПРИНЯТ" : "СТАТУС НЕИЗВЕСТЕН"}
          </span>
          <h3 className="section-title">
            <span>Файл</span>
            <em className="serif-accent">{process.status === "complete" ? "готов" : "обрабатывается"}</em>
          </h3>
          {(
            <p className="body">
              {process.status === "complete"
                ? "Результат сохранён в этом браузере."
                : "Обычно это занимает около минуты. Можно закрыть окно — результат сохранится."}
            </p>
          )}
        </div>
        <div className="message-actions">
          <p className="caption">{copy.demoDuration}</p>
          <div className="actions">
            <PrimaryAction
              disabled={process.status === "running"}
              onClick={() =>
                dispatch({
                  type: "start",
                  key: "background",
                  now: now(),
                  duration: 10000,
                })
              }
            >
              {clear
                ? process.status === "running"
                  ? "Обработка идёт"
                  : "Повторить процесс"
                : "Обработать"}
            </PrimaryAction>
            {(
              <SecondaryAction onClick={() => goTo("comparison")}>
                Читать дальше
              </SecondaryAction>
            )}
          </div>
        </div>
      </div>
      <IllustratedReading part="uncertainty" tail={copy.uncertaintyPrompt} />
    </SectionShell>
  );
}
