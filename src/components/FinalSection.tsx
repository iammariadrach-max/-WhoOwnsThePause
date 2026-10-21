import { useLongread } from "../state/LongreadContext";
import { copy, chapters } from "../content/longread";
import { SectionShell, Content } from "./Shared";
import { PauseAction } from "./Actions";
import { TimerExperience } from "./PerceptionTimer";
import { AfterimageText, MixedTitle, TimecodeRail } from "./EditorialType";
export default function FinalSection() {
  const { state, dispatch } = useLongread();
  return (
    <SectionShell zone={15} className="light final-section">
      <p className="lead">
        {state.timers.first.result === null
          ? copy.firstMissing
          : copy.finalIntro}
      </p>
      <TimerExperience variant="second" />
      <p className="caption">Или не делать.</p>
      <Content part="final" className="reading-offset final-copy" />
      <div className="page-pause">
        <PauseAction
          aria-pressed={state.pageMotionPaused}
          onClick={() => dispatch({ type: "toggleMotion" })}
        >
          {state.pageMotionPaused
            ? "Продолжить движение"
            : "Поставить страницу на паузу"}
        </PauseAction>
        <p className="caption" role="status">
          {state.pauseChosen ? "Эту паузу выбрали вы." : ""}
        </p>
      </div>
      <div
        id="finale"
        tabIndex={-1}
        className={`finale dark ${state.pageMotionPaused ? "is-held" : ""}`}
        data-final-status={state.finaleStatus}
      >
        <TimecodeRail
          label={
            state.pageMotionPaused ? "HOLD / ВЫБРАНО ВАМИ" : "EXPOSURE / 15"
          }
        />
        <div className="finale-copy">
          <p className="meta">15 / 15 — ВАШЕ ВРЕМЯ</p>
          <p className="display">
            <AfterimageText>
              <MixedTitle text={chapters[14].body[8]} accent="ваши." />
            </AfterimageText>
          </p>
          <p className="lead">{chapters[14].body[9]}</p>
        </div>
      </div>
    </SectionShell>
  );
}
