import { useLongread } from "../state/LongreadContext";
import { now } from "../hooks/timing";
import { copy, chapters } from "../content/longread";
import { PrimaryAction, SecondaryAction } from "./Actions";
import { SectionShell, Content, goTo } from "./Shared";
export default function UncertaintySection() {
  const { state, dispatch } = useLongread();
  const process = state.processes.background;
  const clear = process.status !== "idle";
  return (
    <SectionShell zone={4} className="light uncertainty">
      <p className="lead">{chapters[3].body[0]}</p>
      <div className={`message-field ${clear ? "is-clear" : ""}`}>
        <div className="message-questions">
          {copy.uncertaintyQuestions.map((text) => (
            <p key={text} className="caption">
              {text}
            </p>
          ))}
        </div>
        <div className="message-status" aria-live="polite" aria-atomic="true">
          <span className="meta">
            {clear ? "ЗАПРОС ПРИНЯТ" : "СТАТУС НЕИЗВЕСТЕН"}
          </span>
          <h3 className="section-title">
            {process.status === "complete"
              ? "Файл готов."
              : clear
                ? "Файл обрабатывается."
                : "Подождите."}
          </h3>
          {clear && (
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
                : "Добавить ясность"}
            </PrimaryAction>
            {clear && (
              <SecondaryAction onClick={() => goTo("comparison")}>
                Читать дальше
              </SecondaryAction>
            )}
          </div>
        </div>
      </div>
      <Content part="uncertainty" className="reading-offset" />
      <p className="body question-tail">{copy.uncertaintyPrompt}</p>
    </SectionShell>
  );
}
