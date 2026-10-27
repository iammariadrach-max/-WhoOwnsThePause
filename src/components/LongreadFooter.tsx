import { bibliography } from "../content/bibliography";
import ReflectionField from "./ReflectionField";
import { sceneAttributes } from "../content/scenes";
import { MixedTitle } from "./EditorialType";
export default function LongreadFooter() {
  return (
    <footer
      className="longread-footer dark scene-surface reading-revision"
      {...sceneAttributes(15)}
      data-scene="colophon"
      id="colophon"
    >
      <details id="sources" className="sources" open>
        <summary className="sources-toggle"><h2 className="lead"><MixedTitle text="Источники и примечания" /></h2><span className="sources-toggle-label" aria-hidden="true" /></summary>
        <p className="caption">Исследования восприятия времени и критическая рамка. Философские тексты ставят вопросы о производительности, доступности и целях ускорения; они не объясняют результаты отдельных таймеров.</p>
        <ol className="source-list">
          {bibliography.map(source => (
            <li id={`source-${source.number}`} tabIndex={-1} key={source.number}>
              <span className="system-status">[{source.number}]</span>
              <div>
                <h3 className="source-title">{source.title}</h3>
                <p className="source-note">{source.citation}</p>
                <p className="source-note">{source.note}</p>
                <a className="source-link" href={source.url} target="_blank" rel="noreferrer">Источник ↗</a>
              </div>
              <a className="source-back caption" href={`#${source.back}`}>К тексту ↑</a>
            </li>
          ))}
        </ol>
      </details>
      <div className="footer-signature">
      <ReflectionField variant="colophon" />
      <p className="footer-title">
        <span>Собственный</span><em>темп</em>
      </p>
      <div className="footer-bottom">
        <p className="meta">МАРИЯ ДРАЧ</p>
        <p className="meta">ИНТЕРАКТИВНОЕ ЭССЕ</p>
        <p className="meta">2026</p>
      </div>
      </div>
    </footer>
  );
}
