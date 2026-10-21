export const acts = {
  exposure: "I / ЭКСПОЗИЦИЯ",
  instrument: "II / ИЗМЕРИТЕЛЬНЫЙ ПРИБОР",
  silence: "III / ПЕРЕГРУЗКА И ТИШИНА",
  pressure: "IV / ДАВЛЕНИЕ",
  release: "V / ПРОЯВЛЕНИЕ",
};
type Act = keyof typeof acts;
export type Scene = {
  act: Act;
  tone: "dark" | "paper";
  light: string;
  grain: string;
  density: string;
};
export const scenes: Scene[] = [
  {
    act: "exposure",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "open",
  },
  {
    act: "exposure",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "open",
  },
  {
    act: "exposure",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "tracks",
  },
  {
    act: "instrument",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "scattered",
  },
  {
    act: "instrument",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "stage",
  },
  {
    act: "instrument",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "monument",
  },
  {
    act: "instrument",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "timeline",
  },
  {
    act: "instrument",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "split",
  },
  {
    act: "silence",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "overload",
  },
  {
    act: "silence",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "empty",
  },
  {
    act: "pressure",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "poster",
  },
  {
    act: "pressure",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "column",
  },
  {
    act: "pressure",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "fork",
  },
  {
    act: "release",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "probes",
  },
  {
    act: "release",
    tone: "dark",
    light: "none",
    grain: "medium",
    density: "open",
  },
];
export function sceneAttributes(zone: number) {
  const scene = scenes[zone - 1];
  return {
    "data-act": scene.act,
    "data-tone": scene.tone,
    "data-light": scene.light,
    "data-grain": scene.grain,
    "data-density": scene.density,
    "data-zone": zone,
  };
}
