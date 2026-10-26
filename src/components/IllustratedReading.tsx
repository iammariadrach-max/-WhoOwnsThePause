import type { Ref } from "react";
import { editorial } from "../content/editorial";
import EditorialText from "./EditorialText";
import { DotTexture } from "./StaticTexture";
import attention from "../assets/reading/attention.webp";
import uncertainty from "../assets/reading/uncertainty.webp";
import ninetyNine from "../assets/reading/ninety-nine.webp";
import eta from "../assets/reading/eta.webp";
import countdown from "../assets/reading/countdown.webp";
import overload from "../assets/reading/overload.webp";
import rest from "../assets/reading/rest.webp";
import acceleration from "../assets/reading/acceleration.webp";
import final from "../assets/reading/final.webp";

const illustrations = {
  attention: {
    src: attention,
    alt: "Два размытых силуэта беседуют за столиком у окна.",
    caption: "ВРЕМЯ ВНУТРИ ВНИМАНИЯ.",
  },
  uncertainty: {
    src: uncertainty,
    alt: "Свет проступает сквозь матовое стекло закрытой двери.",
    caption: "ПО ТУ СТОРОНУ ОЖИДАНИЯ.",
  },
  ninetyNine: {
    src: ninetyNine,
    alt: "Циферблат часов за запотевшим стеклом.",
    caption: "ПОЧТИ — НЕ ЗНАЧИТ СКОРО.",
  },
  eta: {
    src: eta,
    alt: "Пустая остановка в сумерках; вдали приближаются огни машины.",
    caption: "ПРОГНОЗ СТАНОВИТСЯ ПЛАНОМ.",
  },
  countdown: {
    src: countdown,
    alt: "Песочные часы в полосе мягкого света.",
    caption: "ОДНИ ЦИФРЫ. РАЗНОЕ ДАВЛЕНИЕ.",
  },
  overload: {
    src: overload,
    alt: "Отражения городских окон и размытый силуэт прохожего наслаиваются друг на друга.",
    caption: "КОГДА ВНИМАНИЮ ТЕСНО.",
  },
  rest: {
    src: rest,
    alt: "Пустой деревянный стул у полупрозрачной занавески.",
    caption: "ПАУЗА БЕЗ ОБЯЗАТЕЛЬСТВ.",
  },
  acceleration: {
    src: acceleration,
    alt: "Размытая движением фигура на уходящем вверх эскалаторе.",
    caption: "БЫСТРЕЕ — НО ДЛЯ КОГО?",
  },
  final: {
    src: final,
    alt: "Приоткрытое окно с видом на неподвижную воду и далёкий горизонт.",
    caption: "ВРЕМЯ, КОТОРОЕ МОЖНО ВЫБРАТЬ.",
  },
};

/** The introduction's small photograph / reading-column composition. */
export default function IllustratedReading({
  part,
  className = "",
  ref,
}: {
  part: keyof typeof illustrations;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) {
  const illustration = illustrations[part];
  return (
    <div ref={ref} className={`illustrated-reading reading-offset ${className}`} data-reading={part}>
      <figure className="reading-figure">
        <div className="reading-image">
          <img src={illustration.src} alt={illustration.alt} width={660} height={990} loading="lazy" decoding="async" />
          <DotTexture />
        </div>
        <figcaption>{illustration.caption}</figcaption>
      </figure>
      <EditorialText blocks={editorial[part]} className="illustrated-reading-copy" />
    </div>
  );
}
