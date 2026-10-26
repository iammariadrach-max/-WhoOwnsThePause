import { useRef } from "react";
import { useInView } from "../hooks/useMotion";
import { copy } from "../content/longread";
import { SectionShell, Content } from "./Shared";
import IllustratedReading from "./IllustratedReading";
import { MixedTitle } from "./EditorialType";
export default function AccelerationFork() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, 0.15, true);
  return (
    <SectionShell zone={13} className="dark acceleration">
      <Content part="accelerationIntro" />
      <div
        ref={ref}
        className={`fork-scene ${visible ? "in-view" : ""}`}
        data-anchor-scene="acceleration-fork"
      >
        <p className="lead fork-origin">Технология стала быстрее.</p>
        <div className="fork-stream" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i}>0{i + 1} / WORK</span>
          ))}
        </div>
        <div className="fork-branch" aria-hidden="true" />
        <p className="meta fork-caption">{copy.forkHeading}</p>
        <div className="fork-models">
          {copy.forkNames.map((name, i) => (
            <div className={`fork-model fork-model-${i}`} key={name}>
              <span className="meta">МОДЕЛЬ {i ? "Б" : "А"}</span>
              <h3 className="lead"><MixedTitle text={name} /></h3>
              <p className="caption">{copy.forkCaptions[i]}</p>
              <div
                className="fork-diagram"
                role="img"
                aria-label={
                  i
                    ? "Операции ускоряются, затем их становится больше. Свободного пространства не прибавляется."
                    : "Необходимый труд сокращается, свободного времени становится больше."
                }
              >
                {i ? (
                  <div className="operation-grid">
                    {Array.from({ length: 12 }, (_, j) => (
                      <i key={j}>
                        <span>{String(j + 1).padStart(2, "0")}</span>
                      </i>
                    ))}
                  </div>
                ) : (
                  <div className="labor-space">
                    <div className="labor-block">
                      <span>труд</span>
                    </div>
                    <div className="free-space">
                      <span>свободное время</span>
                    </div>
                  </div>
                )}
              </div>
              <p className="system-status">
                {i
                  ? "Больше операций за тот же интервал"
                  : "Меньше необходимой работы"}
              </p>
            </div>
          ))}
        </div>
      </div>
      <IllustratedReading part="acceleration" className="fork-text" />
    </SectionShell>
  );
}
