import type { EditorialBlock } from "../content/editorial";
import { RichText, SourceMarker } from "./TextSources";

/** Paragraph boundaries express a complete thought, never an animation step. */
export default function EditorialText({
  blocks,
  className = "",
}: {
  blocks: readonly EditorialBlock[];
  className?: string;
}) {
  return (
    <div className={`editorial-text body-copy ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Heading = block.level === 2 ? "h2" : "h3";
          return (
            <Heading key={index} className="lead">
              {block.text}
            </Heading>
          );
        }
        if (block.type === "source") {
          return (
            <p key={index} className="caption">
              <SourceMarker numbers={block.numbers} />
            </p>
          );
        }
        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return (
            <List key={index} className="editorial-list">
              {block.items.map((item) => (
                <li key={item}>
                  <RichText text={item} />
                </li>
              ))}
            </List>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote key={index} className="editorial-quote">
              <p>
                <RichText text={block.text} />
              </p>
            </blockquote>
          );
        }
        const role =
          block.type === "paragraph"
            ? "body"
            : block.type === "status"
              ? "system-status"
              : block.type;
        return (
          <p className={role} key={index}>
            <RichText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
