import { useRef, useState } from "react";
import GradientField from "./GradientField";

export default function HeroPause() {
  const hero = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  return (
    <section id="opening" className="opening" aria-labelledby="hero-title">
      <div className="hero" ref={hero}>
        <GradientField host={hero} paused={paused} />
        <div className="hero-guide guide-one" aria-hidden="true" />
        <div className="hero-guide guide-two" aria-hidden="true" />
        <div className="hero-meta micro">
          <span>01 — ВСТУПЛЕНИЕ</span>
          <span>
            ВРЕМЯ ЕСТЬ.
            <br />А ПАУЗА?
          </span>
        </div>
        <h1 id="hero-title" className="hero-title">
          <span className="title-who">Кому</span>
          <em>принадлежит</em>
          <span className="title-pause">
            пауза<span className="title-question">?</span>
          </span>
        </h1>
        <div className="hero-description">
          Как интерфейсы меняют
          <br />
          переживание ожидания
          <br />и формируют требование
          <br />
          мгновенности
        </div>
        <div className="hero-bottom">
          <a className="scroll-link micro" href="#first-pause">
            <span className="down-arrow" aria-hidden="true">
              ↓
            </span>{" "}
            НЕ СПЕШИТЕ. ЛИСТАЙТЕ.
          </a>
          <div className="field-hint micro">
            <span className="tiny-cross" aria-hidden="true">
              +
            </span>
            <span className="desktop-hint">
              ДВИГАЙТЕ КУРСОР — ВРЕМЯ ОЖИВАЕТ.
              <br />
              ОСТАНОВИТЕСЬ — СВЕТ ЗАМРЁТ.
            </span>
            <span className="mobile-hint">
              КОСНИТЕСЬ СВЕТА.
              <br />
              ДВИЖЕНИЕ МЕНЯЕТ ЕГО РИТМ.
            </span>
          </div>
          <button
            className="field-control micro"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
          >
            {paused ? "ОТПУСТИТЬ ВРЕМЯ ↗" : "ЗАМЕДЛИТЬ ПОЛЕ Ⅱ"}
          </button>
        </div>
      </div>
      <div id="first-pause" className="intro-grid editorial-pad">
        <div className="intro-time">
          <div className="micro intro-label">ОДИН И ТОТ ЖЕ ИНТЕРВАЛ</div>
          <span className="ten">
            10<span className="ten-dot">.</span>
          </span>
          <span className="micro seconds-label">СЕКУНД</span>
          <div className="time-rule" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="intro-copy">
          <p className="lead">
            Десять секунд загрузки могут раздражать сильнее, чем десять минут
            разговора.
          </p>
          <div className="body-copy">
            <p data-reading-reveal>
              Мы привыкли, что интерфейс должен отвечать сразу. Если после
              нажатия ничего не происходит, возникает вопрос: кнопка сработала?
              Система зависла? Нужно нажать ещё раз?
            </p>
            <p data-reading-reveal>
              Интерфейсы научились делать ожидание понятнее и незаметнее.
            </p>
            <p data-reading-reveal>Но достаточно ли просто помочь нам ждать?</p>
          </div>
        </div>
      </div>
      <div className="question-pause editorial-pad">
        <span className="micro">ВОПРОС, КОТОРЫЙ ОСТАЁТСЯ</span>
        <p data-reading-reveal>
          Или хороший интерфейс
          <br className="desktop-break" /> должен ещё и оставлять нам
          <br className="desktop-break" /> <em>контроль</em> над собственным
          <br className="desktop-break" /> временем?
        </p>
        <span className="question-tail" aria-hidden="true">
          ↓
        </span>
      </div>
    </section>
  );
}
