import { useState } from "react";
import { Reference, SectionMarker } from "./Shared";

export default function UncertaintySection() {
  const [clear, setClear] = useState(false);
  return (
    <section
      id="uncertainty"
      className={`uncertainty editorial-pad ${clear ? "is-clear" : ""}`}
      aria-labelledby="uncertainty-title"
    >
      <SectionMarker number="04">НЕИЗВЕСТНОСТЬ</SectionMarker>
      <div className="uncertainty-heading">
        <h2 id="uncertainty-title">
          Неизвестность
          <br />
          тоже заставляет <em>ждать</em>
        </h2>
        <p>
          Представьте, что вы загружаете файл.
          <br />
          Интерфейс отвечает:
        </p>
      </div>
      <div className="message-field">
        <span className="field-corner corner-tl" aria-hidden="true">
          +
        </span>
        <span className="field-corner corner-tr" aria-hidden="true">
          +
        </span>
        <span className="field-corner corner-bl" aria-hidden="true">
          +
        </span>
        <span className="field-corner corner-br" aria-hidden="true">
          +
        </span>
        <div className="uncertain-questions" aria-hidden={clear}>
          <span>Запрос принят?</span>
          <span>Система работает?</span>
          <span>Сколько это займёт?</span>
          <span>Можно закрыть страницу?</span>
        </div>
        <div className="status-message" aria-live="polite" aria-atomic="true">
          {clear ? (
            <>
              <span className="micro status-eyebrow">
                ЗАПРОС ПРИНЯТ / ОБРАБОТКА
              </span>
              <h3>Файл обрабатывается.</h3>
              <p>
                Обычно это занимает около минуты.
                <br />
                Можно закрыть окно — результат сохранится.
              </p>
            </>
          ) : (
            <>
              <span className="micro status-eyebrow">СТАТУС НЕИЗВЕСТЕН</span>
              <h3>Подождите.</h3>
            </>
          )}
        </div>
        <div className="message-control">
          <span className="micro">
            {clear ? "ТЕПЕРЬ ПОНЯТНО, ЧТО ПРОИСХОДИТ." : "ЧТО ПРОИСХОДИТ?"}
          </span>
          <button
            className="text-button"
            onClick={() => setClear((v) => !v)}
            aria-pressed={clear}
          >
            {clear ? "Вернуть неопределённость" : "Добавить ясность"}{" "}
            <span aria-hidden="true">{clear ? "↺" : "↗"}</span>
          </button>
        </div>
      </div>
      <div className="clarity-copy">
        <p className="lead">
          Скорость системы
          <br />
          не изменилась.
          <br />
          <em>
            Но изменилась
            <br />
            ситуация ожидания.
          </em>
        </p>
        <div className="body-copy">
          <p>
            Теперь понятно, что происходит, примерно сколько это займёт и нужно
            ли оставаться у экрана.
          </p>
          <p>Иногда самое полезное сообщение интерфейса звучит не как:</p>
          <p className="muted">«Подождите ещё немного».</p>
          <p>А как:</p>
        </div>
      </div>
      <p className="freedom-quote">
        «Вам не нужно
        <br />
        <em>оставаться</em> здесь».<Reference>2, 4</Reference>
      </p>
    </section>
  );
}
