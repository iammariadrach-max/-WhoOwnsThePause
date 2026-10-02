import { useEffect, useRef, useState } from "react";
import { SectionMarker } from "./Shared";

const INTERVAL = 10_000;
const letters = ["А", "Б", "В"];
type ChoiceMode = "indicator" | "animation" | "read";
type ProcessState = "running" | "complete" | "cancelled";

function ChoiceWait({ onComplete }: { onComplete: () => void }) {
  const [mode, setMode] = useState<ChoiceMode>("indicator");
  const [status, setStatus] = useState<ProcessState>("running");
  const [explanation, setExplanation] = useState(false);
  const [run, setRun] = useState(0);
  const progress = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const callback = useRef(onComplete);
  callback.current = onComplete;
  useEffect(() => {
    if (status !== "running") return;
    const started = performance.now();
    const duration = 20_000;
    let frame = 0;
    function paint() {
      elapsed.current = Math.min((performance.now() - started) / duration, 1);
      if (progress.current)
        progress.current.style.setProperty(
          "--progress",
          `${elapsed.current * 100}%`,
        );
      if (elapsed.current < 1) frame = requestAnimationFrame(paint);
    }
    frame = requestAnimationFrame(paint);
    const timeout = window.setTimeout(() => {
      setStatus("complete");
      callback.current();
    }, duration);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [status, run]);
  function choose(next: ChoiceMode) {
    setMode(next);
    if (next === "read")
      document
        .getElementById("ninety-nine")
        ?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
  }
  return (
    <div className="choice-wait" data-status={status}>
      <div className="choice-intro">
        <span className="micro">ЭКСПЕРИМЕНТ 02.2 / ВОЗВРАЩАЕМ КОНТРОЛЬ</span>
        <h3>
          А теперь —<br />
          <em>на ваших условиях.</em>
        </h3>
        <p>Попробуйте изменить условия следующего ожидания сами.</p>
      </div>
      <div className="mode-selector" role="group" aria-label="Режим ожидания">
        <button
          className={mode === "indicator" ? "selected" : ""}
          aria-pressed={mode === "indicator"}
          onClick={() => choose("indicator")}
        >
          Следить за индикатором <span aria-hidden="true">↗</span>
        </button>
        <button
          className={mode === "animation" ? "selected" : ""}
          aria-pressed={mode === "animation"}
          onClick={() => choose("animation")}
        >
          Смотреть анимацию <span aria-hidden="true">↗</span>
        </button>
        <button
          className={mode === "read" ? "selected" : ""}
          aria-pressed={mode === "read"}
          onClick={() => choose("read")}
        >
          Читать дальше <span aria-hidden="true">↓</span>
        </button>
      </div>
      <p className="mode-note">
        Вы можете переключаться между режимами прямо во время процесса.
      </p>
      <div className="choice-process" ref={progress}>
        <div className="process-live" role="status">
          {status === "complete"
            ? "Готово. Процесс завершён."
            : status === "cancelled"
              ? "Запрос отменён"
              : "Система обрабатывает данные"}
        </div>
        {status === "running" && (
          <>
            {mode === "indicator" && (
              <div
                className="linear-progress choice-progress"
                aria-label="Обработка продолжается"
              >
                <i />
              </div>
            )}
            {mode === "animation" && (
              <div className="breathing-light" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            )}
            {mode === "read" && (
              <p className="muted">
                Читайте в своём темпе. Мы сообщим, когда всё будет готово.
              </p>
            )}
          </>
        )}
        {status !== "running" && (
          <button
            className="text-button"
            onClick={() => {
              elapsed.current = 0;
              setStatus("running");
              setRun((v) => v + 1);
            }}
          >
            Запустить снова <span aria-hidden="true">↺</span>
          </button>
        )}
      </div>
      <div className="choice-controls">
        <button
          className="text-button micro"
          aria-expanded={explanation}
          aria-controls="wait-explanation"
          onClick={() => setExplanation((v) => !v)}
        >
          ПОЧЕМУ НУЖНО ЖДАТЬ?{" "}
          <span aria-hidden="true">{explanation ? "−" : "+"}</span>
        </button>
        {status === "running" && (
          <button
            className="text-button micro"
            onClick={() => setStatus("cancelled")}
          >
            ОТМЕНИТЬ ЗАПРОС <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
      {explanation && (
        <p className="wait-explanation" id="wait-explanation">
          Система обрабатывает данные и проверяет результат. Здесь это
          демонстрация процесса: ваши данные никуда не отправляются.
        </p>
      )}
      <p className="choice-caption">
        Если вы уйдёте читать дальше, мы сообщим, когда процесс закончится.
      </p>
      <div className="choice-closing">
        <p>
          Не существует одного режима, который обязательно окажется лучшим для
          всех.
        </p>
        <p>
          Важно, что теперь режим
          <br />
          ожидания выбираете <em>вы.</em>
        </p>
      </div>
    </div>
  );
}

export default function WaitingExperiment({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"idle" | "running" | "survey">("idle");
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [longest, setLongest] = useState("");
  const [clearest, setClearest] = useState("");
  const bar = useRef<HTMLDivElement>(null);
  const accumulated = useRef(0);
  const phaseStart = useRef(0);
  const focusTarget = useRef<HTMLHeadingElement>(null);
  const complete = longest !== "" && clearest !== "";
  useEffect(() => {
    if (phase !== "running" || paused) return;
    phaseStart.current = performance.now();
    let frame = 0;
    const tick = () => {
      const elapsed =
        accumulated.current + performance.now() - phaseStart.current;
      if (bar.current)
        bar.current.style.setProperty(
          "--progress",
          `${Math.min(1, elapsed / INTERVAL) * 100}%`,
        );
      if (elapsed >= INTERVAL) {
        accumulated.current = 0;
        if (stage === 2) {
          setPhase("survey");
          requestAnimationFrame(() => focusTarget.current?.focus());
        } else setStage((s) => s + 1);
      } else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const hide = () => {
      if (document.hidden) {
        accumulated.current += performance.now() - phaseStart.current;
        setPaused(true);
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [phase, stage, paused]);
  function start() {
    accumulated.current = 0;
    setStage(0);
    setPaused(false);
    setLongest("");
    setClearest("");
    setPhase("running");
  }
  return (
    <section
      id="comparison"
      className="waiting-experiment editorial-pad"
      aria-labelledby="comparison-title"
    >
      <SectionMarker number="05" tag="ЭКСПЕРИМЕНТ 02">
        ФОРМА ОЖИДАНИЯ
      </SectionMarker>
      <div className="waiting-heading">
        <h2 id="comparison-title">
          Один интервал —<br />
          <em>три ощущения</em>
        </h2>
        <p>
          Сейчас вы увидите три варианта одного и того же ожидания. Каждый будет
          длиться ровно 10 секунд.
        </p>
      </div>
      <div className={`experiment-console phase-${phase}`}>
        <div className="console-top">
          <span className="micro">
            {phase === "survey"
              ? "СРАВНЕНИЕ ЗАВЕРШЕНО"
              : "ОДИН ЗАПРОС / ТРИ ИНТЕРФЕЙСА"}
          </span>
          <div
            className="stage-markers"
            aria-label={
              phase === "running"
                ? `Вариант ${letters[stage]}`
                : "Варианты А, Б, В"
            }
          >
            {letters.map((letter, i) => (
              <span
                className={phase === "running" && i === stage ? "active" : ""}
                key={letter}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
        {phase === "idle" && (
          <div className="comparison-start">
            <div className="preview-symbols" aria-hidden="true">
              <span>…</span>
              <span className="static-spinner" />
              <span className="static-line" />
            </div>
            <p>
              Время одно.
              <br />
              <em>Что меняет интерфейс?</em>
            </p>
            <button className="outline-button" onClick={start}>
              Начать сравнение <span aria-hidden="true">↗</span>
            </button>
            <span className="micro start-note">
              ТРИ ПОСЛЕДОВАТЕЛЬНЫХ ОЖИДАНИЯ
            </span>
          </div>
        )}
        {phase === "running" && (
          <div
            className={`comparison-stage variant-${stage} ${paused ? "is-paused" : ""}`}
            data-variant={letters[stage]}
            key={stage}
          >
            <div className="sr-only" role="status">
              Вариант {letters[stage]}. Обрабатываем запрос.
            </div>
            {paused ? (
              <div className="paused-message">
                <p>
                  Сравнение приостановлено,
                  <br />
                  пока вкладка была скрыта.
                </p>
                <button
                  className="outline-button"
                  onClick={() => setPaused(false)}
                >
                  Продолжить сравнение ↗
                </button>
              </div>
            ) : (
              <>
                <span className="micro variant-label">
                  ВАРИАНТ {letters[stage]}
                </span>
                <p>Обрабатываем запрос</p>
                <div className="indicator-slot">
                  {stage === 1 && (
                    <span
                      className="spinner"
                      aria-label="Обработка продолжается"
                    />
                  )}
                  {stage === 2 && (
                    <div
                      ref={bar}
                      className="linear-progress"
                      aria-label="Заполнение полосы прогресса"
                    >
                      <i />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        {phase === "survey" && (
          <div className="comparison-survey">
            <h3 ref={focusTarget} tabIndex={-1}>
              Как это <em>ощущалось?</em>
            </h3>
            <fieldset>
              <legend>Какой вариант показался самым долгим?</legend>
              <div className="answer-options">
                {["А", "Б", "В", "Одинаково", "Не могу сравнить"].map(
                  (answer) => (
                    <label key={answer}>
                      <input
                        type="radio"
                        name="longest"
                        value={answer}
                        checked={longest === answer}
                        onChange={() => setLongest(answer)}
                      />
                      <span>{answer}</span>
                    </label>
                  ),
                )}
              </div>
            </fieldset>
            <fieldset>
              <legend>А в каком было понятнее, что происходит?</legend>
              <div className="answer-options">
                {["А", "Б", "В", "Ни в одном"].map((answer) => (
                  <label key={answer}>
                    <input
                      type="radio"
                      name="clearest"
                      value={answer}
                      checked={clearest === answer}
                      onChange={() => setClearest(answer)}
                    />
                    <span>{answer}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="micro privacy-note">
              ОТВЕТЫ ОСТАЮТСЯ ТОЛЬКО НА ЭТОЙ СТРАНИЦЕ.
            </p>
            {!complete && (
              <p className="survey-hint">
                Ответьте на оба вопроса, чтобы продолжить.
              </p>
            )}
            <button className="text-button micro" onClick={start}>
              ПОВТОРИТЬ СРАВНЕНИЕ <span aria-hidden="true">↺</span>
            </button>
          </div>
        )}
        {phase === "running" && (
          <div className="console-bottom">
            <span className="micro">
              ПОБУДЬТЕ ЗДЕСЬ. ПОЧУВСТВУЙТЕ ИНТЕРВАЛ.
            </span>
            <button
              className="text-button micro"
              onClick={() => {
                setPhase("idle");
                accumulated.current = 0;
              }}
            >
              ПРЕРВАТЬ ×
            </button>
          </div>
        )}
      </div>
      {complete && phase === "survey" && (
        <>
          <div className="comparison-revelation">
            <span className="micro">ЧТО ОСТАЛОСЬ НЕИЗМЕННЫМ</span>
            <p>
              Каждый вариант длился
              <br />
              <em>десять секунд.</em>
            </p>
            <div className="body-copy">
              <p>
                Но ощущение длительности и понятность ожидания — не одно и то
                же.
              </p>
              <p>
                И это ещё не всё. Есть третий вопрос: что вы вообще можете
                делать, пока система работает?
              </p>
            </div>
          </div>
          <ChoiceWait onComplete={onComplete} />
        </>
      )}
      <a className="next-chapter micro" href="#ninety-nine">
        К СЛЕДУЮЩЕЙ ГЛАВЕ <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
