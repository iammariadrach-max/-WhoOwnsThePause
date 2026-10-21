import { useRef } from "react";
import { useInView } from "../hooks/useMotion";
import { useLongread } from "../state/LongreadContext";
import { now } from "../hooks/timing";
import { copy, chapters } from "../content/longread";
import { PrimaryAction, SecondaryAction } from "./Actions";
import { SectionShell, Content, goTo } from "./Shared";
import OverloadField from "./OverloadField";
import { MicroLabel } from "./EditorialType";
import { sceneAttributes } from "../content/scenes";
import { TypeSedimentTransition } from "./SceneTransitions";
export function PartTwo() {
  return (
    <aside
      id="part-two"
      className="part-transition dark scene-surface"
      {...sceneAttributes(9)}
      data-scene="part-two"
    >
      <span className="meta">ЧАСТЬ II</span>
      <p className="section-title">{copy.partTwo}</p>
      <span className="meta">КТО РАСПОРЯЖАЕТСЯ ПАУЗОЙ</span>
    </aside>
  );
}
export function OverloadedPause() {
  const { state, dispatch } = useLongread();
  const field = useRef<HTMLDivElement>(null);
  const visible = useInView(field);
  return (
    <SectionShell zone={9} className="dark overload">
      <Content part="overloadIntro" />
      <div
        data-anchor-scene="type-sediment"
        ref={field}
        className={`overload-field ${state.overloaded ? "is-full" : "is-clear"} ${visible ? "in-view" : ""}`}
      >
        <OverloadField full={state.overloaded} />
        {state.overloaded && (
          <div className="overload-noise" aria-hidden="true">
            {copy.overloadItems.map((text, i) => (
              <span key={text} style={{ animationDelay: `${i * 0.35}s` }}>
                {i === 2 && <i className="spinner" />}
                {text}
              </span>
            ))}
          </div>
        )}
        <div className="overload-center">
          <p className="lead" role="status">
            {state.overloaded ? "Система всё ещё работает." : copy.overloadEnd}
          </p>
          {state.overloaded ? (
            <SecondaryAction
              onClick={() =>
                dispatch({ type: "set", key: "overloaded", value: false })
              }
            >
              Убрать всё
            </SecondaryAction>
          ) : (
            <SecondaryAction onClick={() => goTo("optional-pause")}>
              Можно продолжить чтение
            </SecondaryAction>
          )}
        </div>
      </div>
      <Content part="overload" className="reading-offset" />
      <TypeSedimentTransition clear={!state.overloaded} />
    </SectionShell>
  );
}
export function OptionalPause() {
  const { state, dispatch } = useLongread();
  const status = state.processes.optional.status;
  return (
    <SectionShell zone={10} className="light optional-pause">
      <div className="optional-copy">
        <Content part="optional" className="silence-copy" />
        <div className="optional-space">
          <p className="lead">
            {status !== "idle" ? "Здесь ничего не произойдёт." : ""}
          </p>
          <p role="status" className="system-status">
            {status === "running"
              ? "Пауза началась. Продолжить можно в любой момент."
              : status === "complete"
                ? "Десять секунд прошли."
                : "\u00a0"}
          </p>
        </div>
        <div className="actions">
          <PrimaryAction
            disabled={status === "running"}
            onClick={() =>
              dispatch({
                type: "start",
                key: "optional",
                now: now(),
                duration: 10000,
              })
            }
          >
            Побыть здесь 10 секунд
          </PrimaryAction>
          <SecondaryAction onClick={() => goTo("rest")}>
            Продолжить чтение
          </SecondaryAction>
        </div>
        <p className="caption">Или не делать этого.</p>
        <p className="body optional-end">{copy.optionalEnd}</p>
      </div>
    </SectionShell>
  );
}
export function RestManifesto() {
  const question = useRef<HTMLDivElement>(null);
  const released = useInView(question, 0.5);
  return (
    <SectionShell
      zone={11}
      className={`light rest ${released ? "is-released" : ""}`}
    >
      <MicroLabel className="poster-label">REST / RETURN ON TIME</MicroLabel>
      <Content part="restIntro" />
      <div className="rest-manifesto">
        {copy.restVerbs.map((word, i) => (
          <div key={word}>
            <p className="section-title">{word}</p>
            <div className="rest-kpi">
              <span className="meta">{copy.restKpi[i]}</span>
              <p className="caption">
                — {chapters[10].body[i + 1].split(" — ")[1]}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div ref={question} className="rest-prose reading-offset">
        <Content part="rest" />
      </div>
    </SectionShell>
  );
}
export function ResponsibilityField() {
  return (
    <SectionShell zone={12} className="dark responsibility">
      <div className="responsibility-layout">
        <aside className="responsibility-margin">
          <p className="meta">ТРЕБОВАНИЯ К ЧЕЛОВЕКУ</p>
          {copy.responsibilityDemands.map((text) => (
            <p className="caption" key={text}>
              {text}
            </p>
          ))}
          <div className="responsibility-labels">
            <span className="meta">ЧТО ЗАДАЁТ РИТМ</span>
            {copy.responsibilityLabels.map((text) => (
              <p className="caption" key={text}>
                {text}
              </p>
            ))}
          </div>
        </aside>
        <Content part="responsibility" />
      </div>
    </SectionShell>
  );
}
