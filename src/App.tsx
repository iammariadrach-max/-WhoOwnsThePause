import { useCallback, useEffect, useRef, useState } from "react";
import Navigation from "./components/Navigation";
import { useReadingMotion } from "./hooks/useReadingMotion";
import HeroPause from "./components/HeroPause";
import PerceptionTimer from "./components/PerceptionTimer";
import AttentionSection from "./components/AttentionSection";
import UncertaintySection from "./components/UncertaintySection";
import WaitingExperiment from "./components/WaitingExperiment";
import NinetyNineSection from "./components/NinetyNineSection";

export default function App() {
  useReadingMotion();
  const [toast, setToast] = useState(false);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const notify = useCallback(() => {
    setToast(true);
    clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(false), 9000);
  }, []);
  useEffect(() => () => clearTimeout(toastTimeout.current), []);
  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <Navigation />
      <main id="main">
        <HeroPause />
        <PerceptionTimer />
        <AttentionSection />
        <UncertaintySection />
        <WaitingExperiment onComplete={notify} />
        <NinetyNineSection />
      </main>
      <div
        className={`completion-toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <span className="toast-dot" aria-hidden="true" />
            <span>Готово. Процесс завершён.</span>
            <button
              onClick={() => setToast(false)}
              aria-label="Закрыть уведомление"
            >
              ×
            </button>
          </>
        )}
      </div>
    </>
  );
}
