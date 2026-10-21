import { useEffect, useRef, useState } from "react";
import { chapters, goTo } from "./Shared";
import { useLongread } from "../state/LongreadContext";
export default function Navigation() {
  const { state, dispatch } = useLongread();
  const [current, setCurrent] = useState(0);
  const currentIndex = useRef(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      let next = 0;
      chapters.forEach(({ id }, i) => {
        if (
          (document.getElementById(id)?.getBoundingClientRect().top ??
            Infinity) <=
          innerHeight * 0.4
        )
          next = i;
      });
      if (next !== currentIndex.current) {
        currentIndex.current = next;
        setCurrent(next);
      }
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  useEffect(() => {
    if (state.tocOpen) dialog.current?.showModal();
    else dialog.current?.close();
  }, [state.tocOpen]);
  const close = () => {
    dispatch({ type: "set", key: "tocOpen", value: false });
    opener.current?.focus({ preventScroll: true });
  };
  return (
    <>
      <a className="skip-link" href="#main">
        К тексту
      </a>
      <header className={`site-header ${current === 0 ? "is-cover" : ""}`}>
        <a
          className="wordmark"
          href="#opening"
          aria-label="Кому принадлежит пауза — к началу"
        >
          <span aria-hidden="true">Ⅱ</span> ПАУЗА
        </a>
        <span className="meta chapter-position">
          {String(current + 1).padStart(2, "0")} / {chapters.length}
        </span>
        <button
          ref={opener}
          className="menu-button"
          aria-haspopup="dialog"
          aria-expanded={state.tocOpen}
          aria-controls="contents"
          onClick={() => dispatch({ type: "set", key: "tocOpen", value: true })}
        >
          СОДЕРЖАНИЕ <span aria-hidden="true">+</span>
        </button>
      </header>
      <nav className="chapter-rail" aria-label="Разделы лонгрида">
        {chapters.map(({ id, number, title }, i) => (
          <a key={id} href={`#${id}`} aria-label={`Раздел ${number}. ${title}`} aria-current={current === i ? "location" : undefined}
            onClick={(e) => { e.preventDefault(); goTo(id, true); }}>
            <span className="rail-number" aria-hidden="true">{number}</span><i aria-hidden="true" />
          </a>
        ))}
      </nav>
      <dialog
        ref={dialog}
        id="contents"
        className="contents-dialog"
        data-lenis-prevent
        aria-labelledby="contents-title"
        onCancel={close}
        onClose={() => dispatch({ type: "set", key: "tocOpen", value: false })}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="contents-top">
          <h2 id="contents-title" className="lead">
            Содержание
          </h2>
          <button
            className="close-button"
            onClick={close}
            aria-label="Закрыть содержание"
          >
            ×
          </button>
        </div>
        <nav aria-label="Содержание">
          {chapters.map(({ id, title, number }, i) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={current === i ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                dialog.current?.close();
                dispatch({ type: "set", key: "tocOpen", value: false });
                goTo(id);
              }}
            >
              <span className="meta">{number}</span>
              <span>{title}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
        <p className="caption">
          Можно читать в своём темпе. Любой опыт можно пропустить.
        </p>
      </dialog>
    </>
  );
}
