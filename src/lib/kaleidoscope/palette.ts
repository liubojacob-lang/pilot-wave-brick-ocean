import type { ColorMode } from "./types";

export type Hsla = { h: number; s: number; l: number; a: number };

const TAU = Math.PI * 2;

function wrapHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

export function colorAt(
  mode: ColorMode,
  distNorm: number,
  angle: number,
  time: number,
  hueShift: number,
  out: Hsla,
): void {
  const d = distNorm < 0 ? 0 : distNorm > 1 ? 1 : distNorm;
  const wave = Math.sin(time * 1.4 + angle * 2);

  switch (mode) {
    case "prism":
      out.h = wrapHue((angle / TAU) * 360 + time * 16 + hueShift + d * 48);
      out.s = 82;
      out.l = 58 + wave * 6;
      out.a = 0.72;
      break;
    case "ember":
      out.h = wrapHue(14 + d * 36 + wave * 10 + hueShift * 0.12);
      out.s = 90;
      out.l = 54 + d * 10;
      out.a = 0.78;
      break;
    case "aurora":
      out.h = wrapHue(155 + Math.sin(angle * 3 + time) * 55 + hueShift * 0.35);
      out.s = 72;
      out.l = 56 + wave * 8;
      out.a = 0.7;
      break;
    case "ink":
      out.h = wrapHue(38 + hueShift * 0.18 + d * 8);
      out.s = 38 + d * 22;
      out.l = 74 - d * 22;
      out.a = 0.62;
      break;
    case "ocean":
      out.h = wrapHue(188 + d * 42 + wave * 10 + hueShift * 0.25);
      out.s = 68;
      out.l = 52 + d * 8;
      out.a = 0.74;
      break;
    case "glass": {
      const jewel = (Math.sin(angle * 4 + time * 0.45) + 1) * 0.5;
      out.h = wrapHue((jewel > 0.5 ? 168 : 16) + hueShift * 0.2);
      out.s = 68;
      out.l = 58 + d * 8;
      out.a = 0.76;
      break;
    }
  }
}

export function hslaToString(c: Hsla): string {
  return `hsla(${c.h.toFixed(1)}, ${c.s.toFixed(1)}%, ${c.l.toFixed(1)}%, ${c.a.toFixed(3)})`;
}

export function hslaGlow(c: Hsla): string {
  const l = Math.min(88, c.l + 16);
  return `hsla(${c.h.toFixed(1)}, ${c.s.toFixed(1)}%, ${l.toFixed(1)}%, ${(c.a * 0.28).toFixed(3)})`;
}
