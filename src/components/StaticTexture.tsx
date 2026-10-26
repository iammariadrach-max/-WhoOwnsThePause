import { useEffect, useRef, type CSSProperties } from "react";
import { textureParameters as p } from "../graphics/coverParameters";

export function DotTexture({ className = "" }: { className?: string }) {
  return <span className={`dot-texture ${className}`} aria-hidden="true" style={{
    "--dot-step": `${p.dotStep}px`, "--dot-half-step": `${p.dotStep/2}px`,
    "--dot-radius": `${p.dotRadius}px`, "--dot-opacity": p.dotOpacity,
  } as CSSProperties} />;
}

// One fixed screen-space surface for the entire essay. Never depends on scene time.
export default function StaticTexture() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const paint = () => {
      const width = Math.ceil(canvas.clientWidth), height = Math.ceil(canvas.clientHeight);
      if (!width || !height) return;
      canvas.width = width; canvas.height = height;
      const pixels = ctx.createImageData(width, height);
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        // Integer screen-coordinate hash stays identical after resizing/scrolling.
        let n = Math.imul(x+1,374761393) ^ Math.imul(y+1,668265263) ^ p.seed;
        n = Math.imul(n ^ (n >>> 13),1274126177); n ^= n >>> 16;
        const r = (n >>> 0) / 4294967296;
        const i = (y*width+x)*4, light = r > 0.5;
        pixels.data[i] = pixels.data[i+1] = pixels.data[i+2] = light ? 255 : 0;
        pixels.data[i+3] = Math.round(Math.abs(r*2-1)*(light ? p.grainLightAlpha : p.grainDarkAlpha));
      }
      ctx.putImageData(pixels,0,0);
    };
    const observer = new ResizeObserver(paint);
    observer.observe(canvas); paint();
    return () => observer.disconnect();
  }, []);
  return <div className="grain-overlay" aria-hidden="true">
    <canvas ref={ref} className="static-grain" />
    <DotTexture className="cover-dots" />
  </div>;
}
