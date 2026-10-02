import { useEffect, useRef, useState } from "react";
import { chapters } from "./Shared";

export default function Navigation() {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const cut = window.innerHeight * 0.4;
      let next = 0;
      chapters.forEach(([id], i) => {
        if (
          (document.getElementById(id)?.getBoundingClientRect().top ??
            Infinity) <= cut
        )
          next = i;
      });
      setCurrent(next);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [open]);
  function close() {
    setOpen(false);
    menuButton.current?.focus();
  }
  return (
    <>
      <a className="skip-link" href="#main">
        К содержанию
      </a>
      <header className="site-header">
        <a
          className="wordmark"
          href="#opening"
          aria-label="Кому принадлежит пауза — к началу"
        >
          <span className="pause-mark" aria-hidden="true">
            <i />
            <i />
          </span>
          <span>ПАУЗА</span>
        </a>
        <span className="header-center micro">
          ИНТЕРАКТИВНОЕ ЭССЕ О ВРЕМЕНИ
        </span>
        <button
          ref={menuButton}
          className="menu-button micro"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          СОДЕРЖАНИЕ <span aria-hidden="true">+</span>
        </button>
      </header>
      <nav className="chapter-nav" aria-label="Главы публикации">
        {chapters.map(([id, name], i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={`${i + 1}. ${name}`}
            aria-current={i === current ? "location" : undefined}
          >
            <span>{`0${i + 1}`}</span>
            <i />
          </a>
        ))}
      </nav>
      <dialog
        ref={dialog}
        className="contents-dialog"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        aria-labelledby="contents-title"
      >
        <div className="contents-inner">
          <div className="contents-top">
            <h2 id="contents-title" className="micro">
              ШЕСТЬ СПОСОБОВ ПОЧУВСТВОВАТЬ ПАУЗУ
            </h2>
            <button onClick={close} aria-label="Закрыть содержание">
              ×
            </button>
          </div>
          <nav aria-label="Содержание">
            {chapters.map(([id, name], i) => (
              <a key={id} href={`#${id}`} onClick={close}>
                <span className="micro">0{i + 1}</span>
                {name}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
          <p className="micro contents-note">МОЖНО ЧИТАТЬ В СВОЁМ ТЕМПЕ.</p>
        </div>
      </dialog>
    </>
  );
}
