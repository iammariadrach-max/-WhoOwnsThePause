import ReflectionField from "./ReflectionField";
import { useLongread } from "../state/LongreadContext";
import { copy, chapters } from "../content/longread";
import { SectionShell } from "./Shared";
import IllustratedReading from "./IllustratedReading";
import { TimerExperience } from "./PerceptionTimer";
import { AfterimageText, MixedTitle, TimecodeRail } from "./EditorialType";
export default function FinalSection() {
  const { state } = useLongread();
  return (
    <SectionShell zone={15} className="light final-section" image="final" intro={<p className="lead">
        {state.timers.first.result === null
          ? copy.firstMissing
          : copy.finalIntro}
      </p>}>
      <TimerExperience variant="second" />
      <p className="caption">Или не делать.</p>
      <IllustratedReading part="final" className="final-copy" />
      <div
        id="finale"
        tabIndex={-1}
        className={`finale dark reflection-scene ${state.pageMotionPaused ? "is-held" : ""}`}
        data-final-status={state.finaleStatus}
      >
        <ReflectionField variant="release" />
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
