import { colorAt, hslaGlow, hslaToString, type Hsla } from "./palette";
import { useKaleidoStore } from "./store";
import { type KaleidoSettings } from "./types";

const BG_RGB = "8, 8, 12";
const BG_FILL = "#08080c";
const MAX_COPIES = 48;
const RING = 128;

export class KaleidoEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private raf = 0;
  private ro: ResizeObserver | null = null;
  private running = false;
  private lastTs = 0;
  private time = 0;
  private idleT = 0;
  private cssW = 1;
  private cssH = 1;
  private cx = 0.5;
  private cy = 0.5;
  private maxR = 1;
  private seeded = false;

  private readonly prevX = new Float64Array(MAX_COPIES);
  private readonly prevY = new Float64Array(MAX_COPIES);
  private readonly currX = new Float64Array(MAX_COPIES);
  private readonly currY = new Float64Array(MAX_COPIES);
  private hasPrev = false;

  private readonly hsla: Hsla = { h: 0, s: 0, l: 0, a: 1 };
  private lastPointerX = 0;
  private lastPointerY = 0;
  private pointerInside = false;
  private idlePrevX = 0;
  private idlePrevY = 0;
  private hasIdlePrev = false;

  private readonly ringX = new Float64Array(RING);
  private readonly ringY = new Float64Array(RING);
  private ringHead = 0;
  private ringCount = 0;
  private idleHold = 0;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas 2D is unavailable");
    this.canvas = canvas;
    this.ctx = ctx;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.resize();
    this.seed();
    const target = this.canvas.parentElement ?? this.canvas;
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(target);
    this.bind();
    this.lastTs = 0;
    this.raf = requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    this.ro = null;
    this.unbind();
  }

  clear(): void {
    const { ctx, cssW, cssH } = this;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = BG_FILL;
    ctx.fillRect(0, 0, cssW, cssH);
    this.hasPrev = false;
    this.hasIdlePrev = false;
    this.ringCount = 0;
    this.idleHold = 1.5;
    this.idleT = Math.random() * 12;
  }

  burst(): void {
    const settings = this.settings();
    if (settings.frozen) return;
    this.hasPrev = false;
    const turns = 2.4 + Math.random() * 1.6;
    const steps = 56;
    const scale = 0.18 + Math.random() * 0.28;
    let prevX = this.cx;
    let prevY = this.cy;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const ang = t * Math.PI * 2 * turns + this.time;
      const r = t * this.maxR * scale;
      const x = this.cx + Math.cos(ang) * r;
      const y = this.cy + Math.sin(ang) * r;
      this.strokeSegment(prevX, prevY, x, y, settings);
      prevX = x;
      prevY = y;
    }
    this.hasPrev = false;
  }

  exportPng(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Export failed"));
          return;
        }
        const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `kaleidoscope-${stamp}.png`;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1500);
        resolve();
      }, "image/png");
    });
  }

  private settings(): KaleidoSettings {
    const s = useKaleidoStore.getState();
    return {
      segments: s.segments,
      colorMode: s.colorMode,
      hueShift: s.hueShift,
      brush: s.brush,
      frozen: s.frozen,
    };
  }

  private loop = (ts: number): void => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.loop);
    if (this.lastTs === 0) this.lastTs = ts;
    let dt = (ts - this.lastTs) / 1000;
    this.lastTs = ts;
    if (dt > 0.1) dt = 0.1;
    this.time += dt;
    this.tick(dt);
  };

  private tick(dt: number): void {
    const settings = this.settings();
    this.canvas.style.cursor = settings.frozen ? "default" : "none";

    if (!settings.frozen) {
      this.fade(dt);
      this.drainPointer(settings);
      if (this.idleHold > 0) {
        this.idleHold -= dt;
        this.hasIdlePrev = false;
      } else if (!this.pointerInside) {
        this.advanceIdle(dt, settings);
      } else {
        this.hasIdlePrev = false;
      }
    }
  }

  private fade(dt: number): void {
    const persist = 0.988;
    const alpha = 1 - Math.pow(persist, dt * 60);
    const { ctx, cssW, cssH } = this;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(${BG_RGB}, ${alpha.toFixed(4)})`;
    ctx.fillRect(0, 0, cssW, cssH);
  }

  private drainPointer(settings: KaleidoSettings): void {
    if (this.ringCount === 0) return;
    while (this.ringCount > 0) {
      const i = this.ringHead;
      const x = this.ringX[i] ?? 0;
      const y = this.ringY[i] ?? 0;
      this.ringHead = (this.ringHead + 1) % RING;
      this.ringCount -= 1;
      if (this.hasPrev) {
        this.strokeSegment(this.lastPointerX, this.lastPointerY, x, y, settings);
      } else {
        this.strokeSegment(x, y, x, y, settings);
        this.hasPrev = true;
      }
      this.lastPointerX = x;
      this.lastPointerY = y;
    }
  }

  private advanceIdle(dt: number, settings: KaleidoSettings): void {
    this.idleT += dt;
    const p = this.idlePoint(this.idleT);
    if (this.hasIdlePrev) {
      this.strokeSegment(this.idlePrevX, this.idlePrevY, p.x, p.y, settings);
    }
    this.idlePrevX = p.x;
    this.idlePrevY = p.y;
    this.hasIdlePrev = true;
    this.hasPrev = false;
  }

  private idlePoint(t: number): { x: number; y: number } {
    const k = 3.2 + Math.sin(t * 0.09) * 1.8;
    const theta = t * 0.62;
    const wobble = 0.58 + 0.28 * Math.sin(t * 0.11);
    const r = this.maxR * 0.38 * wobble * Math.cos(k * theta);
    return {
      x: this.cx + Math.cos(theta) * r,
      y: this.cy + Math.sin(theta) * r,
    };
  }

  private seed(): void {
    if (this.seeded) return;
    this.seeded = true;
    const settings: KaleidoSettings = { ...this.settings(), frozen: false };
    const steps = 240;
    let prev = this.idlePoint(0);
    for (let i = 1; i <= steps; i++) {
      const t = i * 0.055;
      const p = this.idlePoint(t);
      if (i % 12 === 0) this.fade(1 / 60);
      this.strokeSegment(prev.x, prev.y, p.x, p.y, settings);
      prev = p;
    }
    this.idleT = steps * 0.055;
    this.idlePrevX = prev.x;
    this.idlePrevY = prev.y;
    this.hasIdlePrev = true;
    this.hasPrev = false;
  }

  private strokeSegment(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    settings: KaleidoSettings,
  ): void {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.min(18, Math.max(1, Math.ceil(dist / 6)));
    let px = x0;
    let py = y0;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      this.stamp(px, py, x, y, settings);
      px = x;
      py = y;
    }
  }

  private stamp(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    settings: KaleidoSettings,
  ): void {
    const n = Math.round(settings.segments);
    this.fillCopies(x0, y0, n, this.prevX, this.prevY);
    this.fillCopies(x1, y1, n, this.currX, this.currY);
    const count = n * 2;

    const dx = x1 - this.cx;
    const dy = y1 - this.cy;
    const distNorm = this.maxR <= 0 ? 0 : Math.min(1, Math.hypot(dx, dy) / (this.maxR * 0.72));
    const angle = Math.atan2(dy, dx);
    colorAt(settings.colorMode, distNorm, angle, this.time, settings.hueShift, this.hsla);
    const core = hslaToString(this.hsla);
    const glow = hslaGlow(this.hsla);

    const { ctx } = this;
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      ctx.moveTo(this.prevX[i] ?? x0, this.prevY[i] ?? y0);
      ctx.lineTo(this.currX[i] ?? x1, this.currY[i] ?? y1);
    }
    ctx.strokeStyle = glow;
    ctx.lineWidth = settings.brush * 2.6;
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      ctx.moveTo(this.prevX[i] ?? x0, this.prevY[i] ?? y0);
      ctx.lineTo(this.currX[i] ?? x1, this.currY[i] ?? y1);
    }
    ctx.strokeStyle = core;
    ctx.lineWidth = settings.brush;
    ctx.stroke();
  }

  private fillCopies(
    x: number,
    y: number,
    segments: number,
    xs: Float64Array,
    ys: Float64Array,
  ): void {
    const { cx, cy } = this;
    const dx = x - cx;
    const dy = y - cy;
    let k = 0;
    for (let i = 0; i < segments; i++) {
      const a = (i * Math.PI * 2) / segments;
      const c = Math.cos(a);
      const s = Math.sin(a);
      xs[k] = cx + dx * c - dy * s;
      ys[k] = cy + dx * s + dy * c;
      k += 1;
      xs[k] = cx + dx * c + dy * s;
      ys[k] = cy + dx * s - dy * c;
      k += 1;
    }
  }

  private resize = (): void => {
    const parent = this.canvas.parentElement;
    const rect = (parent ?? this.canvas).getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const bw = Math.round(w * dpr);
    const bh = Math.round(h * dpr);
    if (this.canvas.width === bw && this.canvas.height === bh && this.cssW === w) return;

    let snapshot: HTMLCanvasElement | null = null;
    if (this.canvas.width > 0 && this.canvas.height > 0 && this.seeded) {
      snapshot = document.createElement("canvas");
      snapshot.width = this.canvas.width;
      snapshot.height = this.canvas.height;
      const sctx = snapshot.getContext("2d");
      sctx?.drawImage(this.canvas, 0, 0);
    }

    this.canvas.width = bw;
    this.canvas.height = bh;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.cssW = w;
    this.cssH = h;
    this.cx = w / 2;
    this.cy = h / 2;
    this.maxR = Math.hypot(this.cx, this.cy);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.fillStyle = BG_FILL;
    this.ctx.fillRect(0, 0, w, h);
    if (snapshot) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.drawImage(snapshot, 0, 0, w, h);
    }
  };

  private pushSample(x: number, y: number): void {
    if (this.ringCount === RING) {
      this.ringHead = (this.ringHead + 1) % RING;
      this.ringCount -= 1;
    }
    const i = (this.ringHead + this.ringCount) % RING;
    this.ringX[i] = x;
    this.ringY[i] = y;
    this.ringCount += 1;
  }

  private localPoint(e: PointerEvent): { x: number; y: number } {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  private onPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    this.canvas.setPointerCapture(e.pointerId);
    const p = this.localPoint(e);
    this.pointerInside = true;
    this.hasPrev = false;
    this.hasIdlePrev = false;
    this.pushSample(p.x, p.y);
    e.preventDefault();
  };

  private onPointerMove = (e: PointerEvent): void => {
    const p = this.localPoint(e);
    if (e.pointerType === "mouse" || e.pointerType === "pen" || e.buttons > 0) {
      this.pointerInside = true;
      this.hasIdlePrev = false;
      this.pushSample(p.x, p.y);
    }
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (this.canvas.hasPointerCapture(e.pointerId)) {
      this.canvas.releasePointerCapture(e.pointerId);
    }
    if (e.pointerType !== "mouse") {
      this.pointerInside = false;
      this.hasPrev = false;
    }
  };

  private onPointerEnter = (e: PointerEvent): void => {
    if (e.pointerType === "mouse" || e.pointerType === "pen") {
      this.pointerInside = true;
      this.hasPrev = false;
      this.hasIdlePrev = false;
    }
  };

  private onPointerLeave = (): void => {
    this.pointerInside = false;
    this.hasPrev = false;
  };

  private onLostCapture = (): void => {
    this.pointerInside = false;
    this.hasPrev = false;
  };

  private bind(): void {
    const el = this.canvas;
    el.addEventListener("pointerdown", this.onPointerDown);
    el.addEventListener("pointermove", this.onPointerMove);
    el.addEventListener("pointerup", this.onPointerUp);
    el.addEventListener("pointercancel", this.onPointerUp);
    el.addEventListener("pointerenter", this.onPointerEnter);
    el.addEventListener("pointerleave", this.onPointerLeave);
    el.addEventListener("lostpointercapture", this.onLostCapture);
  }

  private unbind(): void {
    const el = this.canvas;
    el.removeEventListener("pointerdown", this.onPointerDown);
    el.removeEventListener("pointermove", this.onPointerMove);
    el.removeEventListener("pointerup", this.onPointerUp);
    el.removeEventListener("pointercancel", this.onPointerUp);
    el.removeEventListener("pointerenter", this.onPointerEnter);
    el.removeEventListener("pointerleave", this.onPointerLeave);
    el.removeEventListener("lostpointercapture", this.onLostCapture);
  }
}
