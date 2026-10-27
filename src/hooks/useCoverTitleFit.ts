import { useLayoutEffect, useRef } from 'react'

/** Lift the whole title only by the amount its final glyph is clipped. */
export function useCoverTitleFit() {
  const heroRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const hero = heroRef.current
    const title = hero?.querySelector<HTMLElement>('.cover-title')
    const word = hero?.querySelector<HTMLElement>('.cover-pause')
    if (!hero || !title || !word) return

    const context = document.createElement('canvas').getContext('2d')
    if (!context) return
    let frame = 0
    let disposed = false

    const fit = () => {
      const style = getComputedStyle(word)
      context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      const glyph = context.measureText('З')
      // CSS centers the font's ascent/descent box in the line box.
      const baseline = (parseFloat(style.lineHeight)
        + glyph.fontBoundingBoxAscent - glyph.fontBoundingBoxDescent) / 2
      const top = word.getBoundingClientRect().top - title.getBoundingClientRect().top
      const inkBottom = top + baseline + glyph.actualBoundingBoxDescent
      // One pixel protects the anti-aliased edge; otherwise keep the original layout.
      const lift = Math.max(0, Math.ceil(inkBottom - hero.clientHeight + 1))
      title.style.setProperty('--cover-title-lift', `${lift}px`)
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(fit)
    }
    const resize = new ResizeObserver(schedule)
    resize.observe(hero)
    resize.observe(word)
    document.fonts.addEventListener('loadingdone', schedule)
    document.fonts.ready.then(() => { if (!disposed) schedule() })
    fit()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resize.disconnect()
      document.fonts.removeEventListener('loadingdone', schedule)
    }
  }, [])

  return heroRef
}
