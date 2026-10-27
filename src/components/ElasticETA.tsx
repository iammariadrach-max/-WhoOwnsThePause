import { useLongread } from "../state/LongreadContext";
import { copy, chapters } from "../content/longread";
import { SectionShell, Content, Disclosure } from "./Shared";
import { SecondaryAction } from "./Actions";
import { AfterimageText, MixedTitle, ChapterTitle } from "./EditorialType";
import IllustratedReading from "./IllustratedReading";
export default function ElasticETA() {
  const { state, dispatch } = useLongread();
  const updated = state.etaState === "updated" || state.reducedMotion;
  return (
    <SectionShell zone={7} className="light eta" title={false}>
      <div className="eta-layout pause-study--forecast">
        <div className="eta-reading">
          <h2 id="eta-title" className="section-title eta-title">
            <ChapterTitle zone={7} text={chapters[6].title} />
          </h2>
          <div className="eta-intro">
            <h3 className="lead"><MixedTitle text={chapters[6].body[0]} /></h3>
            <Content part="etaIntro" />
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
        </div>
        <div
          className={`eta-scene ${updated ? "is-updated" : ""}`}
          data-anchor-scene="elastic-eta"
        >
          <div className="eta-light-leak" aria-hidden="true" />
          <div className="eta-number">
            <span className="meta">МАШИНА ПРИЕДЕТ ЧЕРЕЗ</span>
            <p aria-live="polite" aria-atomic="true">
              <span className="eta-ghost" aria-hidden="true">
                {updated ? "7" : ""}
              </span>
              <span className="eta-current" key={updated ? "nine" : "seven"}>
                <AfterimageText>{updated ? "9" : "7"}</AfterimageText>
              </span>
              <span className="system-status">МИН</span>
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
          {updated && <p className="caption eta-gap">В вашем плане осталось 5 минут. Новый прогноз — 9.</p>}
          <Disclosure title="Почему изменился прогноз?">
            {copy.etaWhy}
            <p>Числа в этой сцене иллюстративные.</p>
          </Disclosure>
        </div>
      </div>
      <IllustratedReading part="eta" className="eta-after" />
    </SectionShell>
  );
}
