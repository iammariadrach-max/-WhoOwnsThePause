import { Fragment, useId } from "react";
export function SourceMarker({ numbers }: { numbers: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <span
      className="source-marker"
      tabIndex={-1}
      id={`ref-${id}`}
      data-source={numbers}
    >
      [
      {numbers.split(", ").map((number, i) => (
        <Fragment key={number}>
          {i > 0 && ", "}
          <a
            href={`#source-${number}`}
            aria-label={`Источник ${number}`}
            onClick={() => {
              const back = document.querySelector<HTMLAnchorElement>(
                `#source-${number} .source-back`,
              );
              if (back) back.href = `#ref-${id}`;
            }}
          >
            {number}
          </a>
        </Fragment>
      ))}
      ]
    </span>
  );
}
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/(\[\d+(?:, \d+)*\])/g)
        .map((part, i) =>
          /^\[\d/.test(part) ? (
            <SourceMarker key={i} numbers={part.slice(1, -1)} />
          ) : (
            part
          ),
        )}
    </>
  );
}
