import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BRUSH_MAX,
  BRUSH_MIN,
  COLOR_MODES,
  DEFAULT_SETTINGS,
  SEGMENTS_MAX,
  SEGMENTS_MIN,
  type ColorMode,
  type KaleidoSettings,
} from "./types";

type KaleidoState = KaleidoSettings & {
  setSegments: (segments: number) => void;
  setColorMode: (colorMode: ColorMode) => void;
  setBrush: (brush: number) => void;
  setHueShift: (hueShift: number) => void;
  setFrozen: (frozen: boolean) => void;
  toggleFrozen: () => void;
  randomize: () => void;
};

const SEGMENT_CHOICES = [5, 6, 7, 8, 9, 10, 12, 14, 16, 18];

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T;
}

export const useKaleidoStore = create<KaleidoState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      setSegments: (segments) =>
        set({ segments: Math.round(clamp(segments, SEGMENTS_MIN, SEGMENTS_MAX)) }),
      setColorMode: (colorMode) => set({ colorMode }),
      setBrush: (brush) => set({ brush: clamp(brush, BRUSH_MIN, BRUSH_MAX) }),
      setHueShift: (hueShift) => set({ hueShift: ((hueShift % 360) + 360) % 360 }),
      setFrozen: (frozen) => set({ frozen }),
      toggleFrozen: () => set({ frozen: !get().frozen }),
      randomize: () =>
        set({
          segments: pick(SEGMENT_CHOICES),
          colorMode: pick(COLOR_MODES).id,
          hueShift: Math.random() * 360,
          brush: Math.round((BRUSH_MIN + 2 + Math.random() * (BRUSH_MAX - BRUSH_MIN - 4)) * 2) / 2,
          frozen: false,
        }),
    }),
    {
      name: "kaleidoscope-v1",
      partialize: (state) => ({
        segments: state.segments,
        colorMode: state.colorMode,
        hueShift: state.hueShift,
        brush: state.brush,
      }),
    },
  ),
);
