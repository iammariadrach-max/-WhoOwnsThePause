import { useLongread } from "../state/LongreadContext";
import { useElapsedTimer } from "../hooks/useElapsedTimer";
import { now } from "../hooks/timing";
import { copy } from "../content/longread";
import { PrimaryAction, SkipAction } from "./Actions";
import { SectionShell, Content } from "./Shared";
export default function NinetyNineSection() {
  const { dispatch } = useLongread();
  const timer = useElapsedTimer("ninetyNine");
  const t = timer.elapsed;
  const value =
    timer.status === "idle"
      ? 99
      : t < 300
        ? 0
        : t < 650
          ? 40
          : t < 1000
            ? 75
            : t < 1400
              ? 94
              : 99;
  const checked = timer.status === "complete" || timer.status === "cancelled";
  return (
    <SectionShell zone={6} className="dark ninety-nine">
      <p className="lead">
        Полоса почти заполнена. Кажется, осталось совсем немного.
      </p>
      <div className="ninety-stage">
        <p className="micro-label">WORK COMPLETED / TIME REMAINING</p>
        <div className="ninety-display">
          {checked ? (
            <p className="section-title checking-label">
              Проверяем
              <br />
              результат
            </p>
          ) : (
            <p className="huge-percent" aria-hidden="true">
              {value}
              <span>%</span>
            </p>
          )}
        </div>
        <div className="ninety-progress" aria-hidden="true">
          <i style={{ width: `${value}%` }} />
        </div>
        <dl className="progress-facts">
          <div>
            <dt className="meta">ВЫПОЛНЕНО</dt>
            <dd className="system-status">{value} из 100 файлов</dd>
          </div>
          <div>
            <dt className="meta">ОСТАВШЕЕСЯ ВРЕМЯ</dt>
            <dd className="system-status">неизвестно</dd>
          </div>
        </dl>
        <p className="system-status pause-sequence">
          {timer.status === "running" && t >= 2400
            ? t >= 4400
              ? "Проходит секунда. Ещё одна. И ещё."
              : t >= 3400
                ? "Проходит секунда. Ещё одна."
                : "Проходит секунда."
            : "\u00a0"}
        </p>
        <p className="sr-only" role="status">
          {checked
            ? "Проверяем результат. Оставшееся время неизвестно."
            : timer.status === "running" && value === 99
              ? "99 процентов. Ожидание продолжается."
              : "Доля работы не определяет время ожидания."}
        </p>
      </div>
      <div className="actions">
        <PrimaryAction
          disabled={timer.status === "running"}
          onClick={() =>
            dispatch({
              type: "start",
              key: "ninetyNine",
              now: now(),
              duration: 5400,
            })
          }
        >
          {timer.status === "idle" ? "Посмотреть ожидание" : "Повторить"}
        </PrimaryAction>
        {timer.status === "running" && (
          <SkipAction
            onClick={() =>
              dispatch({
                type: "settle",
                key: "ninetyNine",
                status: "cancelled",
                run: timer.run,
              })
            }
          >
            Пропустить ожидание
          </SkipAction>
        )}
      </div>
      <Content
        part="ninetyNine"
        className="reading-offset progress-explanation"
      />
      <p className="caption progress-conclusion">{copy.progressConclusion}</p>
    </SectionShell>
  );
}
