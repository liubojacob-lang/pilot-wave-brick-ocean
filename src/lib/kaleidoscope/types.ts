export const COLOR_MODES = [
  { id: "prism", label: "光谱" },
  { id: "ember", label: "焰色" },
  { id: "aurora", label: "极光" },
  { id: "ink", label: "墨韵" },
  { id: "ocean", label: "深海" },
  { id: "glass", label: "琉璃" },
] as const;

export type ColorMode = (typeof COLOR_MODES)[number]["id"];

export type KaleidoSettings = {
  segments: number;
  colorMode: ColorMode;
  hueShift: number;
  brush: number;
  frozen: boolean;
};

export const SEGMENTS_MIN = 3;
export const SEGMENTS_MAX = 24;
export const BRUSH_MIN = 3;
export const BRUSH_MAX = 18;

export const DEFAULT_SETTINGS: KaleidoSettings = {
  segments: 8,
  colorMode: "prism",
  hueShift: 28,
  brush: 7,
  frozen: false,
};
