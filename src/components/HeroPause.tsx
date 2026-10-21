import { useState } from "react";
import CoverField from "./CoverField";
import { PrimaryAction } from "./Actions";
import { Content, goTo } from "./Shared";
import { copy, chapters } from "../content/longread";
import { sceneAttributes } from "../content/scenes";
export default function HeroPause() {
  const chapter = chapters[0];
  const [fieldPaused, setFieldPaused] = useState(false);
  return (
    <section id={chapter.id} tabIndex={-1} aria-labelledby="hero-title" className="opening dark scene-surface" {...sceneAttributes(1)} data-scene={chapter.id}>
      <div className="hero">
        <CoverField paused={fieldPaused} />
        <p className="meta hero-eyebrow">ИНТЕРАКТИВНОЕ ЭССЕ</p>
        <p className="meta hero-subtitle">КАК ИНТЕРФЕЙСЫ МЕНЯЮТ ПЕРЕЖИВАНИЕ ОЖИДАНИЯ<br />И ФОРМИРУЮТ ТРЕБОВАНИЕ МГНОВЕННОСТИ</p>
        <h1 id="hero-title" className="cover-title">
          <span className="cover-who">КОМУ</span>{" "}
          <em className="cover-belongs">принадлежит</em>{" "}
          <span className="cover-pause">ПАУЗА?</span>
        </h1>
        <a href="#introduction" className="cover-forward" onClick={(e) => { e.preventDefault(); goTo("introduction", true); }}><span aria-hidden="true">↓</span> ВПЕРЕД</a>
        <button className="cover-motion" aria-pressed={fieldPaused} onClick={() => setFieldPaused(!fieldPaused)}>
          {fieldPaused ? "ВОЗОБНОВИТЬ ПОЛЕ" : "ЗАМЕДЛИТЬ ПОЛЕ"}<span aria-hidden="true">{fieldPaused ? "▷" : "Ⅱ"}</span>
        </button>
      </div>
      <div id="introduction" tabIndex={-1} className="intro-body editorial-grid">
        <span className="meta">{chapter.number} / {chapters.length} — НАЧАЛО</span>
        <div className="intro-reading">
          <p className="body intro-lead">{copy.lead}</p>
          <Content part="opening" />
          <PrimaryAction onClick={() => goTo("perception")}>Почувствовать 10 секунд</PrimaryAction>
        </div>
      </div>
    </section>
  );
}
