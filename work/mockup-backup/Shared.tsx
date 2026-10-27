import { useId, type ReactNode } from "react";
import EditorialText from "./EditorialText";
import { editorial, type EditorialPart } from "../content/editorial";
export { SourceMarker, RichText } from "./TextSources";
import SceneFigure, { type SceneImage } from "./SceneFigure";
import { chapters } from "../content/longread";
import { scenes, acts, sceneAttributes } from "../content/scenes";
import { MixedTitle } from "./EditorialType";
import { scrollToElement } from "../hooks/scrollDriver";
export { chapters } from "../content/longread";
export function goTo(id: string, smooth = false) {
  const target = document.getElementById(id);
  if (target) scrollToElement(target, smooth);
  target?.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
}
export function BodyText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`body-copy ${className}`}>{children}</div>;
}
export function Content({
  part,
  className = "",
}: {
  part: EditorialPart;
  className?: string;
}) {
  return <EditorialText blocks={editorial[part]} className={className} />;
}
export function SectionShell({
  zone,
  children,
  className = "",
  title = true,
  image,
  intro,
}: {
  zone: number;
  children: ReactNode;
  className?: string;
  title?: boolean;
  image?: SceneImage;
  intro?: ReactNode;
}) {
  const chapter = chapters[zone - 1];
  return (
    <section
      id={chapter.id}
      tabIndex={-1}
      className={`section scene-surface reading-revision ${className}`}
      {...sceneAttributes(zone)}
      data-scene={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
    >
      <div className="section-meta meta">
        <span className="chapter-index">CH. {chapter.number} / {chapters.length}</span>
        <span>{acts[scenes[zone - 1].act]}</span>
        <span aria-hidden="true">+</span>
      </div>
      {image ? (
        <div className="scene-introduction">
          <div className="scene-introduction-copy">
            <h2 id={`${chapter.id}-title`} className="section-title">
              <MixedTitle text={chapter.title} accent={zone === 15 ? "ваши" : undefined} />
            </h2>
            {intro}
          </div>
          <SceneFigure image={image} />
        </div>
      ) : title && (
        <h2 id={`${chapter.id}-title`} className="section-title">
          <MixedTitle
            text={chapter.title}
            accent={zone === 6 ? "долгий" : zone === 15 ? "ваши" : undefined}
          />
        </h2>
      )}
      {children}
    </section>
  );
}
export function Choice({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <fieldset className="choice">
      <legend className="lead">{title}</legend>
      <div className="choice-options">
        {options.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name={id}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function Disclosure({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="disclosure">
      <summary>{title}</summary>
      <div className="caption">{children}</div>
    </details>
  );
}
