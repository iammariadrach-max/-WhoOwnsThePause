import { useLongread } from "../state/LongreadContext";
import { useElapsedTimer } from "../hooks/useElapsedTimer";
import { now, countdown } from "../hooks/timing";
import { PrimaryAction, SkipAction } from "./Actions";
import { SectionShell, Content } from "./Shared";
import IllustratedReading from "./IllustratedReading";
import { MixedTitle } from "./EditorialType";
export function CountdownDisplay({ value }: { value: number }) {
  return (
    <p className="countdown-display" aria-hidden="true">
      {countdown(value)}
    </p>
  );
}
export default function CountdownComparison() {
  const { dispatch } = useLongread();
  const timer = useElapsedTimer("countdown");
  const finished = timer.status === "complete" || timer.status === "cancelled";
  const value = timer.status === "idle" ? 10000 : timer.remaining;
  return (
    <SectionShell zone={8} className="light countdown">
      <Content part="countdownIntro" />
      <div className="countdown-split">
        {["Код подтверждения", "Скидка закончится"].map((title, i) => (
          <div key={title}>
            <span className="meta">
              {i ? "СИТУАЦИЯ ВТОРАЯ" : "СИТУАЦИЯ ПЕРВАЯ"}
            </span>
            <h3 className="lead"><MixedTitle text={title} /></h3>
            <CountdownDisplay value={finished ? (i ? 10000 : 0) : value} />
            <p className="system-status">
              {finished
                ? i
                  ? "Таймер снова запущен. Условия не изменились."
                  : "Код больше не действует."
                : "Осталось десять секунд."}
            </p>
          </div>
        ))}
      </div>
      <div className="actions">
        <PrimaryAction
          disabled={timer.status === "running"}
          onClick={() =>
            dispatch({
              type: "start",
              key: "countdown",
              now: now(),
              duration: 10000,
            })
          }
        >
          {timer.status === "idle"
            ? "Запустить оба таймера"
            : "Повторить сравнение"}
        </PrimaryAction>
        {!finished && (
          <SkipAction
            onClick={() => {
              if (timer.status === "idle")
                dispatch({
                  type: "start",
                  key: "countdown",
                  now: now(),
                  duration: 0,
                });
              else
                dispatch({
                  type: "settle",
                  key: "countdown",
                  status: "cancelled",
                  run: timer.run,
                });
            }}
          >
            Пропустить сравнение
          </SkipAction>
        )}
      </div>
      <p role="status" className="caption countdown-result">
        {finished
          ? "После нуля код перестал действовать. Таймер скидки снова показывает 00:10. Что действительно произошло после нуля?"
          : "Оба таймера начнутся одновременно. Разница станет видна после нуля."}
      </p>
      <IllustratedReading part="countdown" />
    </SectionShell>
  );
}
