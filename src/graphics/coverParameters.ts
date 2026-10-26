/** Scene coordinates are fractions of the hero, y increases downwards.
 * Colors were sampled from the supplied references; no image is loaded at runtime.
 * Edit these values to art-direct the still frame before tuning motion.
 */
export const coverParameters = {
  base: [10, 11, 10],
  upper: {
    color: [76, 86, 83],
    intensity: 1,
    edgeColor: [71, 70, 61],
    edgeWarmth: 0.65,
    leftShade: { center: [0.22, 0.23], size: [0.2, 0.13], intensity: 0.18 },
    // Lower contour, sampled at equal x intervals. Catmull–Rom preserves the lobes.
    edge: [0.123, 0.13, 0.148, 0.158, 0.164, 0.18, 0.195, 0.228, 0.242, 0.27, 0.30, 0.32, 0.371, 0.421, 0.451, 0.423, 0.438, 0.403, 0.414, 0.38, 0.383, 0.358, 0.346, 0.317, 0.325, 0.316, 0.298, 0.29, 0.27, 0.242, 0.205, 0.20, 0.195],
    // Half-width of each edge's transition: tight on the left, diffuse in the centre.
    softness: [0.065, 0.055, 0.068, 0.067, 0.085, 0.076, 0.095, 0.12, 0.115, 0.08, 0.085, 0.073, 0.083, 0.072, 0.065, 0.077, 0.083],
    contourDetailPx: 5,
  },
  // A shallow, dark fold separates the upper-right shelves of light.
  fold: { center: [0.77, 0.19], size: [0.27, 0.059], intensity: 0.44 },
  tail: { center: [0.48, 0.46], size: [0.14, 0.135], color: [48, 43, 35], intensity: 0.72 },
  ribbon: {
    x: [0.265, 1.0],
    y: 0.58,
    // Two fine left tips merge into a softer body and a long, diffuse right tail.
    bend: [-0.004, -0.011, -0.007, 0, 0.012, 0.02, 0.033, 0.036, 0.028],
    halfWidth: [0.001, 0.005, 0.022, 0.026, 0.026, 0.024, 0.018, 0.011, 0.002],
    softness: [0.006, 0.011, 0.02, 0.034, 0.036, 0.038, 0.04, 0.032, 0.016],
    fork: { separation: 0.028, mergeStart: 0.1, mergeEnd: 0.29, lowerStart: 0.055, lowerIntensity: 0.78, tipSoftness: 0.007 },
    color: [93, 101, 93],
    intensity: 0.87,
    haloColor: [58, 44, 32],
    haloWidth: 0.11,
    haloIntensity: 0.55,
    warmAfterglow: { center: [0.73, 0.67], size: [0.43, 0.17], color: [38, 30, 23], intensity: 0.52 },
  },
  motion: {
    // Maximum local displacement at 1440 × 900; actual travel is lower.
    // Calibrated against recorded frames so changes are visible within 3–5s.
    horizontalPx: 72,
    verticalPx: 10,
    speed: 0.58,
    spatialScale: [3.2, 4.4],
    seed: 19.37,
  },
  render: { maxPixelRatio: 1.25, referenceAspect: 1.6, minHorizontalSpan: 0.5 },
} as const;

export const textureParameters = {
  seed: 713,
  grainDarkAlpha: 60,
  grainLightAlpha: 14,
  dotStep: 6,
  dotRadius: 0.85,
  dotOpacity: 0.20,
} as const;
