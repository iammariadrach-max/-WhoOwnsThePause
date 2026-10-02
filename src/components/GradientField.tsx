import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "../hooks/useMotion";

/** The field has no independent clock: pointer energy drives its phase and decays to zero. */
export default function GradientField({
  host,
  paused,
}: {
  host: RefObject<HTMLElement | null>;
  paused: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const reduced = useReducedMotion();
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    const element = canvas.current;
    const container = host.current;
    const ctx = element?.getContext("2d", { alpha: true });
    if (!element || !container || !ctx) return;
    let width = 0,
      height = 0,
      frame = 0,
      phase = 0,
      energy = 0,
      held = false,
      visible = true;
    let px = 0.63,
      py = 0.5,
      tx = 0.63,
      ty = 0.5,
      lastX = 0,
      lastY = 0,
      lastTime = 0;
    function glow(
      x: number,
      y: number,
      radius: number,
      rgb: string,
      opacity: number,
    ) {
      const g = ctx!.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, `rgba(${rgb},${opacity})`);
      g.addColorStop(0.3, `rgba(${rgb},${opacity * 0.65})`);
      g.addColorStop(0.68, `rgba(${rgb},${opacity * 0.12})`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      ctx!.fillStyle = g;
      ctx!.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    function draw() {
      if (!ctx || !element) return;
      ctx.clearRect(0, 0, width, height);
      const mobile = container!.clientWidth < 769;
      const cx = width * (mobile ? 0.55 : 0.61) + (px - 0.5) * width * 0.045;
      const cy = height * (mobile ? 0.49 : 0.5) + (py - 0.5) * height * 0.035;
      const rx = width * (mobile ? 0.44 : 0.255),
        ry = height * (mobile ? 0.12 : 0.205);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.42 + Math.sin(phase) * 0.06);
      ctx.globalCompositeOperation = "screen";
      const palette = [
        "209,170,136",
        "225,190,148",
        "211,178,172",
        "188,177,212",
        "156,177,208",
        "216,219,213",
      ];
      for (let i = 0; i < 60; i++) {
        const a = (i / 60) * Math.PI * 2;
        const strength = 0.16 + Math.sin(a + 1.5 + phase * 0.2) * 0.09;
        const radius =
          Math.min(width, height) * (0.085 + 0.025 * Math.sin(a * 2 + phase));
        glow(
          Math.cos(a) * rx,
          Math.sin(a) * ry,
          radius,
          palette[Math.floor(i / 10)],
          strength,
        );
      }
      ctx.restore();
      ctx.globalCompositeOperation = "screen";
      glow(width * 0.33, height * 0.62, width * 0.27, "122,119,140", 0.045);
      if (energy > 0.02 && !reduced)
        glow(
          px * width,
          py * height,
          width * 0.16,
          "207,196,228",
          Math.min(energy * 0.026, 0.1),
        );
      ctx.globalCompositeOperation = "source-over";
      container!.style.setProperty(
        "--field-stretch",
        String(1 + Math.min(energy, 2) * 0.005),
      );
    }
    function tick() {
      frame = 0;
      if (!visible || document.hidden || reduced) return;
      energy *= held || pausedRef.current ? 0.83 : 0.965;
      px += (tx - px) * 0.065;
      py += (ty - py) * 0.065;
      if (!pausedRef.current && !held) phase += energy * 0.007;
      draw();
      if (energy > 0.004 || Math.abs(tx - px) + Math.abs(ty - py) > 0.001)
        frame = requestAnimationFrame(tick);
      else {
        energy = 0;
        draw();
      }
    }
    function wake() {
      if (!frame && visible && !reduced && !document.hidden)
        frame = requestAnimationFrame(tick);
    }
    function resize() {
      const ratio = Math.min(devicePixelRatio, 1.5) * 0.6;
      width = Math.round(container!.clientWidth * ratio);
      height = Math.round(container!.clientHeight * ratio);
      element!.width = width;
      element!.height = height;
      draw();
    }
    function move(e: PointerEvent) {
      const r = container!.getBoundingClientRect(),
        now = performance.now();
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
      const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (lastTime && now - lastTime < 200 && !held && !pausedRef.current)
        energy = Math.min(
          3,
          energy + (distance / Math.max(16, now - lastTime)) * 0.12,
        );
      else if (!held && !pausedRef.current) energy = Math.max(energy, 0.22);
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
      wake();
    }
    function down(e: PointerEvent) {
      if (e.pointerType === "touch") move(e);
      if (
        e.pointerType !== "touch" &&
        !(e.target as HTMLElement).closest("a,button")
      )
        held = true;
      wake();
    }
    function up() {
      held = false;
    }
    function visibility() {
      if (!document.hidden) wake();
    }
    const resizeObserver = new ResizeObserver(resize);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    resizeObserver.observe(container);
    observer.observe(container);
    resize();
    container.addEventListener("pointermove", move, { passive: true });
    container.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      container.removeEventListener("pointermove", move);
      container.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [host, reduced]);
  return <canvas className="gradient-field" ref={canvas} aria-hidden="true" />;
}
