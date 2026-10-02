import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "../hooks/useMotion";
import { Reference, SectionMarker } from "./Shared";

export default function NinetyNineSection() {
  const stage = useRef<HTMLDivElement>(null);
  const visible = useInView(stage, 0.4);
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [iteration, setIteration] = useState(0);
  const elapsed = useRef(0);
  const ended = useRef(false);
  useEffect(() => {
    if (!visible || ended.current) return;
    let previous = performance.now(),
      frame = 0;
    function tick(now: number) {
      if (!document.hidden) elapsed.current += Math.min(now - previous, 100);
      previous = now;
      const t = elapsed.current;
      const next =
        t < 200
          ? 0
          : t < 550
            ? 1
            : t < 900
              ? 2
              : t < 1250
                ? 3
                : t < 2250
                  ? 4
                  : t < 3250
                    ? 5
                    : t < 4250
                      ? 6
                      : t < 5250
                        ? 7
                        : 8;
      setStep((old) => (old === next ? old : next));
      if (next < 8) frame = requestAnimationFrame(tick);
      else ended.current = true;
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, iteration]);
  const percentage = reduced ? 99 : [0, 40, 75, 94, 99][Math.min(step, 4)];
  const checked = step === 8;
  function replay() {
    elapsed.current = 0;
    ended.current = false;
    setStep(0);
    setIteration((v) => v + 1);
    stage.current?.scrollIntoView({
      block: "center",
      behavior: reduced ? "instant" : "smooth",
    });
  }
  return (
    <section
      id="ninety-nine"
      className="ninety-nine editorial-pad"
      aria-labelledby="ninety-title"
    >
      <SectionMarker number="06">ОБЕЩАНИЕ ИНДИКАТОРА</SectionMarker>
      <div className="ninety-heading">
        <h2 id="ninety-title">
          Почему последний
          <br />
          процент <em>такой долгий</em>
        </h2>
        <p>
          Полоса почти заполнена.
          <br />
          Кажется, осталось совсем немного.
        </p>
      </div>
      <div
        ref={stage}
        className={`ninety-stage ${checked ? "is-checked" : ""}`}
      >
        <div className="ninety-display" aria-hidden="true">
          {checked ? (
            <p className="checking-label">
              Проверяем
              <br />
              <em>результат</em>
              <span className="checking-dot">.</span>
            </p>
          ) : (
            <p className="huge-percent">
              {percentage}
              <span>%</span>
            </p>
          )}
        </div>
        <div className="ninety-progress" aria-hidden="true">
          <i style={{ width: `${checked ? 99 : percentage}%` }} />
        </div>
        <div className="ninety-bottom">
          <div className="pause-sequence" aria-hidden="true">
            <span className={step >= 5 ? "appeared" : ""}>
              Проходит секунда.
            </span>
            <span className={step >= 6 ? "appeared" : ""}>Ещё одна.</span>
            <span className={step >= 7 ? "appeared" : ""}>И ещё.</span>
          </div>
          <span className="micro">
            {checked ? "ТОЧНОСТЬ ≠ ЯСНОСТЬ" : "ПОЧТИ — НЕ ЗНАЧИТ ГОТОВО"}
          </span>
        </div>
        <p className="sr-only" role="status">
          {checked
            ? "Вместо процента появился статус: Проверяем результат."
            : step >= 4
              ? "99 процентов. Ожидание продолжается."
              : "Обрабатываем запрос."}
        </p>
      </div>
      <div className="ninety-explanation">
        <div>
          <p className="lead">
            Почему последний процент иногда длится дольше предыдущих девяноста
            девяти?
          </p>
          <button className="text-button micro" onClick={replay}>
            ПОЧУВСТВОВАТЬ ЕЩЁ РАЗ <span aria-hidden="true">↺</span>
          </button>
        </div>
        <div className="body-copy">
          <p className="emphasis">
            Потому что процент выполненной работы и процент прошедшего времени —
            не обязательно одно и то же.
          </p>
          <p>
            Система могла обработать 99 из 100 файлов — но последний оказался
            самым большим.
          </p>
          <p>
            Или основная операция закончилась, но теперь нужно проверить
            результат.
          </p>
          <p>
            В такой ситуации число 99% создаёт обещание, которого система не
            обязательно может выполнить.
          </p>
          <p>
            Иногда честное «Проверяем результат» полезнее, чем точное число без
            объяснения.
          </p>
          <p className="research-note">
            Исследования progress bar показывают, что характер движения
            индикатора способен влиять на восприятие ожидания. Но универсальной
            траектории, которая делает любое ожидание хорошим, не существует.{" "}
            <Reference>3</Reference>
          </p>
        </div>
      </div>
      <footer className="site-footer">
        <div className="footer-pause">
          <span className="pause-mark" aria-hidden="true">
            <i />
            <i />
          </span>
          <p>
            Пауза остаётся
            <br />
            <em>за вами.</em>
          </p>
        </div>
        <div className="footer-bottom micro">
          <span>
            КОМУ ПРИНАДЛЕЖИТ ПАУЗА
            <br />
            ИНТЕРАКТИВНАЯ ПУБЛИКАЦИЯ
          </span>
          <span>ПЕРВЫЕ ШЕСТЬ ГЛАВ / 2026</span>
          <a href="#opening">К НАЧАЛУ ↑</a>
        </div>
      </footer>
    </section>
  );
}
