import { useLongread } from "../state/LongreadContext";
import { copy, chapters } from "../content/longread";
import { SectionShell, Content } from "./Shared";
import { DestructiveAction, SecondaryAction } from "./Actions";
import { MixedTitle } from "./EditorialType";
export default function ControlDiagnostic() {
  const { state, dispatch } = useLongread();
  return (
    <SectionShell zone={14} className="light control">
      <Content part="controlIntro" />
      <div className="diagnostic">
        <div className="diagnostic-object">
          <span className="meta">ОДИН ОБЪЕКТ / ПЯТЬ ВОПРОСОВ</span>
          <h3 className="lead">
            <MixedTitle text={state.diagnosticCancelled
              ? "Подготовка отменена"
              : "Документ готовится"} />
          </h3>
          <p className="system-status">
            {state.diagnosticCancelled
              ? "Вы можете изменить решение."
              : "Осталась примерно 1 минута"}
          </p>
          <p className="caption">
            Иллюстрация интерфейса. Реальный документ не создаётся.
          </p>
        </div>
        <div className="diagnostic-questions">
          {copy.diagnosticQuestions.map((question, i) => (
            <div
              className={`diagnostic-row ${state.diagnostic === i ? "is-selected" : ""}`}
              key={question}
            >
              <h4>
                <button
                  aria-expanded={state.diagnostic === i}
                  aria-controls={`diagnostic-answer-${i}`}
                  id={`diagnostic-question-${i}`}
                  onClick={() =>
                    dispatch({
                      type: "set",
                      key: "diagnostic",
                      value: state.diagnostic === i ? -1 : i,
                    })
                  }
                >
                  <span className="meta">0{i + 1}</span>
                  <span><MixedTitle text={question} /></span>
                  <span aria-hidden="true">
                    {state.diagnostic === i ? "−" : "+"}
                  </span>
                </button>
              </h4>
              <div
                id={`diagnostic-answer-${i}`}
                className="diagnostic-answer"
                role="region"
                aria-labelledby={`diagnostic-question-${i}`}
                hidden={state.diagnostic !== i}
              >
                <p className="lead">
                  {i === 3 && state.diagnosticCancelled
                    ? "Подготовка отменена."
                    : copy.diagnosticAnswers[i]}
                </p>
                <p className="body">{chapters[13].body[6 + i * 2]}</p>
                {i === 3 &&
                  (state.diagnosticCancelled ? (
                    <SecondaryAction
                      onClick={() =>
                        dispatch({
                          type: "set",
                          key: "diagnosticCancelled",
                          value: false,
                        })
                      }
                    >
                      Вернуть подготовку
                    </SecondaryAction>
                  ) : (
                    <DestructiveAction
                      onClick={() =>
                        dispatch({
                          type: "set",
                          key: "diagnosticCancelled",
                          value: true,
                        })
                      }
                    >
                      Отменить подготовку
                    </DestructiveAction>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <p className="sr-only" role="status">
          {state.diagnosticCancelled
            ? "Подготовка отменена."
            : state.diagnostic >= 0
              ? copy.diagnosticAnswers[state.diagnostic]
              : ""}
        </p>
      </div>
      <Content part="control" className="reading-offset" />
    </SectionShell>
  );
}
