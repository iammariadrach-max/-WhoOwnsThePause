import { useEffect, useRef, useState } from "react";
import { Reference, SectionMarker } from "./Shared";
import { useInView, useReducedMotion } from "../hooks/useMotion";

export default function AttentionSection() {
  const timeline = useRef<HTMLDivElement>(null);
  const visible = useInView(timeline, 0.5);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [iteration, setIteration] = useState(0);
  const hasPlayed = useRef(false);
  useEffect(() => {
    if (visible && !hasPlayed.current && !reduced) {
      hasPlayed.current = true;
      setPlaying(true);
    }
  }, [visible, reduced]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setPlaying(false), 10000);
    return () => clearTimeout(timer);
  }, [playing, iteration]);
  return (
    <section
      id="attention"
      className="attention editorial-pad"
      aria-labelledby="attention-title"
    >
      <SectionMarker number="03">ВРЕМЯ И ВНИМАНИЕ</SectionMarker>
      <div className="attention-heading">
        <span className="micro side-note">
          СЕКУНДЫ ОДИНАКОВЫЕ.
          <br />
          ПЕРЕЖИВАНИЕ — НЕТ.
        </span>
        <h2 id="attention-title">
          Время зависит
          <br />
          <em>от внимания</em>
        </h2>
      </div>
      <p className="comparison-intro">Представьте две ситуации.</p>
      <div
        ref={timeline}
        className={`attention-timelines ${playing ? "is-playing" : ""}`}
        key={iteration}
      >
        <div className="attention-track">
          <div className="track-title">
            <span>Вы разговариваете с человеком</span>
            <span className="micro">10 SEC</span>
          </div>
          <div className="track-content conversation" aria-hidden="true">
            <span>слушаю</span>
            <span>а потом?</span>
            <span>понимаю</span>
            <span>да, точно</span>
            <span>и ты?</span>
            <div className="conversation-wave">∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿</div>
          </div>
          <div className="interval-line">
            <i />
          </div>
          <span className="micro track-caption">
            ВНИМАНИЕ НАПРАВЛЕНО НА СОБЕСЕДНИКА
          </span>
        </div>
        <div className="attention-track">
          <div className="track-title">
            <span>Вы ждёте ответа интерфейса</span>
            <span className="micro">10 SEC</span>
          </div>
          <div className="track-content waiting" aria-hidden="true">
            <span>…</span>
          </div>
          <div className="interval-line">
            <i />
          </div>
          <span className="micro track-caption">
            ВНИМАНИЕ НАПРАВЛЕНО НА ОЖИДАНИЕ
          </span>
        </div>
      </div>
      <div className="timeline-controls">
        <span className="micro">ДВА ОТРЕЗКА. ОДНА ДЛИТЕЛЬНОСТЬ.</span>
        <button
          className="text-button micro"
          onClick={() => {
            setIteration((v) => v + 1);
            setPlaying(true);
          }}
        >
          {playing ? "НАЧАТЬ ЗАНОВО" : "ПОСМОТРЕТЬ ЕЩЁ РАЗ"}{" "}
          <span aria-hidden="true">↺</span>
        </button>
      </div>
      <div className="attention-explanation">
        <p className="lead">
          На часах проходит одинаковое время.
          <br />
          <span className="muted">Но переживаться оно может по-разному.</span>
        </p>
        <p className="body-copy">
          Когда внимание занято разговором, мы следим за собеседником. Когда
          перед нами неподвижный экран, внимание легко переключается на само
          ожидание:
        </p>
      </div>
      <div className="how-long">
        <div className="how-long-sticky">
          <span className="micro">МЫСЛЬ, К КОТОРОЙ МЫ ВОЗВРАЩАЕМСЯ</span>
          <p>
            Сколько
            <br />
            <em>ещё?</em>
          </p>
        </div>
        <div className="how-long-copy body-copy">
          <p>Имеет значение и то, когда мы оцениваем время.</p>
          <p>
            Следить за интервалом прямо сейчас и вспоминать его спустя время —
            разные задачи для внимания и памяти. <Reference>1</Reference>
          </p>
          <p>
            Поэтому субъективное время — это не внутренний секундомер, который
            просто иногда ошибается.
          </p>
          <p className="emphasis">
            То, куда направлено наше внимание, становится частью переживания
            времени.
          </p>
        </div>
      </div>
    </section>
  );
}
