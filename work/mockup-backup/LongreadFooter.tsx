import { copy, sourceNumbers } from "../content/longread";
import { sceneAttributes } from "../content/scenes";
import { TimecodeRail, MixedTitle } from "./EditorialType";
export default function LongreadFooter() {
  return (
    <footer
      className="longread-footer dark scene-surface reading-revision"
      {...sceneAttributes(15)}
      data-scene="colophon"
      id="colophon"
    >
      <TimecodeRail label="END OF EXPOSURE" />
      <div id="sources" className="sources" tabIndex={-1}>
        <h2 className="lead"><MixedTitle text="Источники и примечания" /></h2>
        <p className="caption">{copy.sourceIntro}</p>
        <ol className="source-list">
          {sourceNumbers.map((number) => (
            <li id={`source-${number}`} tabIndex={-1} key={number}>
              <span className="system-status">[{number}]</span>
              <p className="caption">{copy.sourceMissing}</p>
              <a
                className="source-back caption"
                href={
                  number === 1
                    ? "#attention"
                    : number === 2
                      ? "#uncertainty"
                      : number === 3
                        ? "#ninety-nine"
                        : number === 4
                          ? "#eta"
                          : number === 5
                            ? "#overload"
                            : number === 6
                              ? "#rest"
                              : number === 7
                                ? "#responsibility"
                                : "#acceleration"
                }
              >
                К тексту ↑
              </a>
            </li>
          ))}
        </ol>
      </div>
      <p className="footer-title">
        <span>Собственный</span><em>темп.</em>
      </p>
      <div className="footer-bottom">
        <p className="meta">
          МАРИЯ ДРАЧ
          <br />
          АВТОРСКОЕ ИНТЕРАКТИВНОЕ ЭССЕ / 2026
        </p>
      </div>
    </footer>
  );
}
