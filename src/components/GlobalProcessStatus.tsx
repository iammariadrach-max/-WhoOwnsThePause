import { useLongread } from "../state/LongreadContext";
export default function GlobalProcessStatus() {
  const { state } = useLongread();
  const { background, secondary, optional } = state.processes;
  const messages = [
    background.status === "running"
      ? "Файл обрабатывается."
      : background.status === "complete"
        ? "Файл готов."
        : "",
    secondary.status === "running"
      ? "Запрос выполняется."
      : secondary.status === "complete"
        ? "Готово. Процесс завершён."
        : secondary.status === "cancelled"
          ? "Запрос отменён."
          : "",
    optional.status === "complete" ? "Десять секунд прошли." : "",
  ].filter(Boolean);
  return (
    <aside
      className={`global-status ${messages.length ? "has-status" : ""}`}
      aria-label="Фоновые процессы"
    >
      <div role="status" aria-live="polite" aria-atomic="true">
        {messages.map((message) => (
          <span key={message}>{message}</span>
        ))}
      </div>
    </aside>
  );
}
