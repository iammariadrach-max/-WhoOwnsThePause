import { useEffect, useRef, useState } from "react";
import { SectionMarker } from "./Shared";

type TimerState = "idle" | "running" | "finished";
export default function PerceptionTimer() {
  const [state, setState] = useState<TimerState>("idle");
  const [result, setResult] = useState(0);
  const startedAt = useRef(0);
  const action = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.body.classList.toggle("perception-running", state === "running");
    return () => document.body.classList.remove("perception-running");
  }, [state]);
  function start() {
    startedAt.current = performance.now();
    setResult(0);
    setState("running");
  }
  function stop() {
    setResult((performance.now() - startedAt.current) / 1000);
    setState("finished");
  }
  function reset() {
    startedAt.current = 0;
    setResult(0);
    setState("idle");
    requestAnimationFrame(() => action.current?.focus({ preventScroll: true }));
  }
  return (
    <section
      id="perception"
      className={`perception light-section editorial-pad is-${state}`}
      aria-labelledby="perception-title"
    >
      <SectionMarker number="02" tag="ЭКСПЕРИМЕНТ 01">
        ВНУТРЕННЕЕ ВРЕМЯ
      </SectionMarker>
      <div className="perception-heading">
        <h2 id="perception-title">
          Сколько длятся
          <br />
          <em>десять секунд?</em>
        </h2>
        <p className="micro">
          БЕЗ ЧАСОВ.
          <br />
          БЕЗ ПОДСКАЗОК.
          <br />
          ТОЛЬКО ВАШЕ ОЩУЩЕНИЕ.
        </p>
      </div>
      <div className="timer-stage" aria-live="polite" aria-atomic="true">
        {state === "idle" && (
          <>
            <div className="timer-instructions">
              <p>Попробуйте почувствовать их без часов.</p>
              <p>
                Нажмите «Начать» и остановите отсчёт, когда вам покажется, что
                прошло десять секунд.
              </p>
              <span className="micro">ПОСТАРАЙТЕСЬ НЕ СЧИТАТЬ ПРО СЕБЯ.</span>
            </div>
            <button ref={action} className="circle-button" onClick={start}>
              <span>Начать</span>
              <span aria-hidden="true">↗</span>
            </button>
          </>
        )}
        {state === "running" && (
          <div className="timer-active">
            <p>
              Кажется, прошло
              <br />
              <em>10 секунд</em>
            </p>
            <button className="solid-button" onClick={stop} autoFocus>
              Остановить <span aria-hidden="true">Ⅱ</span>
            </button>
          </div>
        )}
        {state === "finished" && (
          <div className="timer-result">
            <span className="micro">ПО ВАШЕМУ ОЩУЩЕНИЮ — 10 СЕКУНД.</span>
            <p className="result-value">
              <span className="sr-only">По таймеру — </span>
              {result.toLocaleString("ru-RU", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
              <span>с.</span>
            </p>
            <span className="micro" aria-hidden="true">
              ПО ТАЙМЕРУ
            </span>
            <div className="result-actions">
              <button className="text-button" onClick={reset} autoFocus>
                Повторить <span aria-hidden="true">↺</span>
              </button>
              <a className="text-button" href="#attention">
                Читать дальше <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="timer-footnote">
        <span className="micro">ЭТО НЕ ТЕСТ НА ТОЧНОСТЬ.</span>
        <div>
          <p>
            Одна попытка ничего не говорит о том, насколько хорошо вы
            «чувствуете время».
          </p>
          <p>
            Здесь важнее другое: как вообще возникает ощущение, что десять
            секунд уже прошли?
          </p>
        </div>
      </div>
    </section>
  );
}
