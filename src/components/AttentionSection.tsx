import ReflectionField from "./ReflectionField";
import { useState } from "react";
import { SectionShell, Choice } from "./Shared";
import IllustratedReading from "./IllustratedReading";
import { MixedTitle } from "./EditorialType";
import { copy } from "../content/longread";
export default function AttentionSection() {
  const [answers, setAnswers] = useState<(string | null)[]>([null, null]);
  return (
    <SectionShell zone={3} className="dark attention">
      <ReflectionField variant="attention" />
      <p className="lead">Представьте две ситуации.</p>
      <div className="attention-tracks">
        {["Вы разговариваете с человеком", "Вы ждёте ответа интерфейса"].map(
          (title, i) => (
            <div className="attention-track" key={title}>
              <div className="track-heading">
                <h3 className="body"><MixedTitle text={title} /></h3>
                <span className="system-status">10 SEC</span>
              </div>
              <div
                className={`track-events ${i ? "waiting-events" : ""}`}
                aria-hidden="true"
              >
                {i ? (
                  <span>…</span>
                ) : (
                  copy.conversation.map((text, j) => (
                    <span
                      key={text}
                      style={{ alignSelf: j % 2 ? "end" : "start" }}
                    >
                      {text}
                    </span>
                  ))
                )}
              </div>
              <div className="interval-line" />
              <p className="meta">
                {i ? "ВНИМАНИЕ — НА ОЖИДАНИИ" : "ВНИМАНИЕ — НА СОБЕСЕДНИКЕ"}
              </p>
            </div>
          ),
        )}
      </div>
      <IllustratedReading part="attention" />
      <div id="attention-reflection" tabIndex={-1} className="attention-memory reflection-scene">
        <ReflectionField variant="memory" />
        <div className="attention-memory-content">
          <div className="attention-questions">
            {copy.attentionQuestions.map((title, i) => (
              <div key={title}>
                <span className="meta">{i ? "ПОТОМ" : "СЕЙЧАС"}</span>
                <Choice
                  title={title}
                  options={["Долго", "Коротко", "Не могу определить"]}
                  value={answers[i]}
                  onChange={(value) =>
                    setAnswers(answers.map((old, j) => (j === i ? value : old)))
                  }
                />
                <p className="caption">
                  {copy.attentionCaptions[i]} Ответ необязателен.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
