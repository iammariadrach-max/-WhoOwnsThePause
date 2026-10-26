import { useState } from 'react'
import { useCoverTitleFit } from '../hooks/useCoverTitleFit'
import CoverField from './CoverField'
import { DotTexture } from './StaticTexture'
import { Content, goTo } from './Shared'
import { copy, chapters } from '../content/longread'
import { sceneAttributes } from '../content/scenes'
import introWaiting from '../assets/intro-waiting.webp'
export default function HeroPause() {
  const heroRef = useCoverTitleFit()
  const chapter = chapters[0]
  const [fieldPaused, setFieldPaused] = useState(false)
  return (
    <section
      id={chapter.id}
      tabIndex={-1}
      aria-labelledby="hero-title"
      className="opening dark scene-surface"
      {...sceneAttributes(1)}
      data-scene={chapter.id}
    >
      <div ref={heroRef} className="hero">
        <CoverField paused={fieldPaused} />
        <p className="meta hero-eyebrow">МАРИЯ ДРАЧ</p>
        <p className="meta hero-subtitle">
          КАК ИНТЕРФЕЙСЫ МЕНЯЮТ ПЕРЕЖИВАНИЕ ОЖИДАНИЯ
          <br />И ФОРМИРУЮТ ТРЕБОВАНИЕ МГНОВЕННОСТИ
        </p>
        <h1 id="hero-title" className="cover-title">
          <span className="cover-who">КОМУ</span>{' '}
          <em className="cover-belongs">принадлежит</em>{' '}
          <span className="cover-pause">ПАУЗА?</span>
        </h1>
        <a
          href="#introduction"
          className="cover-forward"
          onClick={(e) => {
            e.preventDefault()
            goTo('introduction', true)
          }}
        >
          <span aria-hidden="true">↓</span> ВПЕРЕД
        </a>
        <button
          className="cover-motion"
          aria-controls="cover-field"
          aria-pressed={fieldPaused}
          onClick={() => setFieldPaused((value) => !value)}
        >
          {fieldPaused ? 'ПРОДОЛЖИТЬ ДВИЖЕНИЕ' : 'ЗАМЕДЛИТЬ ПОЛЕ'}
          <span aria-hidden="true">{fieldPaused ? '▷' : 'Ⅱ'}</span>
        </button>
      </div>
      <div id="introduction" tabIndex={-1} className="intro-body">
        <figure className="intro-figure">
          <div className="intro-image">
            <img
              src={introWaiting}
              alt="Размытый силуэт человека за стеклом в приглушённом свете."
              width={1024}
              height={1536}
              loading="lazy"
              decoding="async"
            />
            <DotTexture className="intro-image-dots" />
          </div>
          <figcaption>МЕЖДУ ДЕЙСТВИЕМ И ОТВЕТОМ.</figcaption>
        </figure>
        <div className="intro-reading">
          <p className="body intro-lead">{copy.lead}</p>
          <Content part="opening" />
        </div>
      </div>
    </section>
  )
}
