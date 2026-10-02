import type { ReactNode } from "react";

export const chapters = [
  ["opening", "Вступление"],
  ["perception", "Десять секунд"],
  ["attention", "Внимание"],
  ["uncertainty", "Неизвестность"],
  ["comparison", "Три ощущения"],
  ["ninety-nine", "Последний процент"],
] as const;

export function SectionMarker({
  number,
  children,
  tag,
}: {
  number: string;
  children: ReactNode;
  tag?: string;
}) {
  return (
    <div className="section-marker">
      <span>
        <span className="marker-cross">+</span> {number} / 06
      </span>
      <span>{children}</span>
      <span className="marker-tag">{tag ?? "КОМУ ПРИНАДЛЕЖИТ ПАУЗА"}</span>
    </div>
  );
}

export function Reference({ children }: { children: ReactNode }) {
  return (
    <sup className="reference" aria-label={`Ссылка на источник ${children}`}>
      [{children}]
    </sup>
  );
}
