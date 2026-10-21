let driver: ((element: HTMLElement, smooth: boolean) => void) | null = null;
export function registerScrollDriver(next: typeof driver) { driver = next; }
export function scrollToElement(element: HTMLElement, smooth = false) {
  const animate = smooth && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (driver) driver(element, animate);
  else element.scrollIntoView({ behavior: animate ? "smooth" : "instant", block: "start" });
}
