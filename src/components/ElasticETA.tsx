import { useLongread } from "../state/LongreadContext";
import { copy, chapters } from "../content/longread";
import { SectionShell, Content, Disclosure } from "./Shared";
import { SecondaryAction } from "./Actions";
import { AfterimageText, MicroLabel } from "./EditorialType";
export default function ElasticETA() {
  const { state, dispatch } = useLongread();
  const updated = state.etaState === "updated" || state.reducedMotion;
  return (
    <SectionShell zone={7} className="light eta" title={false}>
      <div className="eta-layout">
        <div className="eta-reading">
          <h2 id="eta-title" className="section-title eta-title">
            {chapters[6].title}
          </h2>
          <h3 className="lead">{chapters[6].body[0]}</h3>
          <Content part="etaIntro" />
          <p className="caption">
            Иллюстративная сцена: ждать две реальные минуты не нужно.
          </p>
          <SecondaryAction
            onClick={() =>
              dispatch({
                type: "set",
                key: "etaState",
                value: updated ? "initial" : "updated",
              })
            }
          >
            {updated ? "Вернуться к первому прогнозу" : "Две минуты спустя"}
          </SecondaryAction>
        </div>
        <div
          className={`eta-scene ${updated ? "is-updated" : ""}`}
          data-anchor-scene="elastic-eta"
        >
          <div className="eta-light-leak" aria-hidden="true" />
          <MicroLabel className="eta-micro">
            {updated
              ? "FORECAST UPDATED / +02:00 / LAST DATA 12 SEC AGO"
              : "SYSTEM TIME / HUMAN PLAN"}
          </MicroLabel>
          <div className="eta-number">
            <span className="meta">МАШИНА ПРИЕДЕТ ЧЕРЕЗ</span>
            <p aria-live="polite" aria-atomic="true">
              <span className="eta-ghost" aria-hidden="true">
                {updated ? "7" : ""}
              </span>
              <span className="eta-current" key={updated ? "nine" : "seven"}>
                <AfterimageText>{updated ? "9" : "7"}</AfterimageText>
              </span>
              <span className="system-status">MIN</span>
            </p>
          </div>
          <p className="meta eta-elapsed">
            {updated
              ? "2 МИНУТЫ СПУСТЯ / ПРОГНОЗ ОБНОВЛЁН"
              : "СЕЙЧАС / ПЕРВЫЙ ПРОГНОЗ"}
          </p>
          <div className="eta-track">
            <div className="eta-system-line" />
            <div className="eta-plan">
              {copy.etaPlan.map((text, i) => (
                <div key={text} className={`eta-stop eta-stop-${i}`}>
                  <i />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="eta-arrival">
              <i />
              <span className="caption">
                {updated ? "новое прибытие" : "прибытие"}
              </span>
            </div>
          </div>
          <div className="eta-legend">
            <p className="caption">
              <i />
              Прогноз системы
            </p>
            <p className="caption">
              <i />
              Обещание в плане человека
            </p>
          </div>
          <p className="caption eta-gap">
            {updated
              ? "В вашем плане осталось 5 минут. Система теперь обещает 9. Действия уже были запланированы."
              : "Семь минут уже распределены между вашими действиями."}
          </p>
          <Disclosure title="Почему изменился прогноз?">
            {copy.etaWhy}
            <p>Числа в этой сцене иллюстративные.</p>
          </Disclosure>
        </div>
      </div>
      <Content part="eta" className="reading-offset eta-after" />
    </SectionShell>
  );
}
