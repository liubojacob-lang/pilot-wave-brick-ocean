import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Dices, i as Download, n as Snowflake, r as Eraser } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-SIGnYlO5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TAU = Math.PI * 2;
function wrapHue(h) {
	return (h % 360 + 360) % 360;
}
function colorAt(mode, distNorm, angle, time, hueShift, out) {
	const d = distNorm < 0 ? 0 : distNorm > 1 ? 1 : distNorm;
	const wave = Math.sin(time * 1.4 + angle * 2);
	switch (mode) {
		case "prism":
			out.h = wrapHue(angle / TAU * 360 + time * 16 + hueShift + d * 48);
			out.s = 82;
			out.l = 58 + wave * 6;
			out.a = .72;
			break;
		case "ember":
			out.h = wrapHue(14 + d * 36 + wave * 10 + hueShift * .12);
			out.s = 90;
			out.l = 54 + d * 10;
			out.a = .78;
			break;
		case "aurora":
			out.h = wrapHue(155 + Math.sin(angle * 3 + time) * 55 + hueShift * .35);
			out.s = 72;
			out.l = 56 + wave * 8;
			out.a = .7;
			break;
		case "ink":
			out.h = wrapHue(38 + hueShift * .18 + d * 8);
			out.s = 38 + d * 22;
			out.l = 74 - d * 22;
			out.a = .62;
			break;
		case "ocean":
			out.h = wrapHue(188 + d * 42 + wave * 10 + hueShift * .25);
			out.s = 68;
			out.l = 52 + d * 8;
			out.a = .74;
			break;
		case "glass":
			out.h = wrapHue(((Math.sin(angle * 4 + time * .45) + 1) * .5 > .5 ? 168 : 16) + hueShift * .2);
			out.s = 68;
			out.l = 58 + d * 8;
			out.a = .76;
	}
}
function hslaToString(c) {
	return `hsla(${c.h.toFixed(1)}, ${c.s.toFixed(1)}%, ${c.l.toFixed(1)}%, ${c.a.toFixed(3)})`;
}
function hslaGlow(c) {
	const l = Math.min(88, c.l + 16);
	return `hsla(${c.h.toFixed(1)}, ${c.s.toFixed(1)}%, ${l.toFixed(1)}%, ${(c.a * .28).toFixed(3)})`;
}
var COLOR_MODES = [
	{
		id: "prism",
		label: "光谱"
	},
	{
		id: "ember",
		label: "焰色"
	},
	{
		id: "aurora",
		label: "极光"
	},
	{
		id: "ink",
		label: "墨韵"
	},
	{
		id: "ocean",
		label: "深海"
	},
	{
		id: "glass",
		label: "琉璃"
	}
];
var DEFAULT_SETTINGS = {
	segments: 8,
	colorMode: "prism",
	hueShift: 28,
	brush: 7,
	frozen: false
};
var SEGMENT_CHOICES = [
	5,
	6,
	7,
	8,
	9,
	10,
	12,
	14,
	16,
	18
];
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function pick(list) {
	return list[Math.floor(Math.random() * list.length)];
}
var useKaleidoStore = create()(persist((set, get) => ({
	...DEFAULT_SETTINGS,
	setSegments: (segments) => set({ segments: Math.round(clamp(segments, 3, 24)) }),
	setColorMode: (colorMode) => set({ colorMode }),
	setBrush: (brush) => set({ brush: clamp(brush, 3, 18) }),
	setHueShift: (hueShift) => set({ hueShift: (hueShift % 360 + 360) % 360 }),
	setFrozen: (frozen) => set({ frozen }),
	toggleFrozen: () => set({ frozen: !get().frozen }),
	randomize: () => set({
		segments: pick(SEGMENT_CHOICES),
		colorMode: pick(COLOR_MODES).id,
		hueShift: Math.random() * 360,
		brush: Math.round((5 + Math.random() * 11) * 2) / 2,
		frozen: false
	})
}), {
	name: "kaleidoscope-v1",
	partialize: (state) => ({
		segments: state.segments,
		colorMode: state.colorMode,
		hueShift: state.hueShift,
		brush: state.brush
	})
}));
var BG_RGB = "8, 8, 12";
var BG_FILL = "#08080c";
var MAX_COPIES = 48;
var RING = 128;
var KaleidoEngine = class {
	canvas;
	ctx;
	raf = 0;
	ro = null;
	running = false;
	lastTs = 0;
	time = 0;
	idleT = 0;
	cssW = 1;
	cssH = 1;
	cx = .5;
	cy = .5;
	maxR = 1;
	seeded = false;
	prevX = new Float64Array(MAX_COPIES);
	prevY = new Float64Array(MAX_COPIES);
	currX = new Float64Array(MAX_COPIES);
	currY = new Float64Array(MAX_COPIES);
	hasPrev = false;
	hsla = {
		h: 0,
		s: 0,
		l: 0,
		a: 1
	};
	lastPointerX = 0;
	lastPointerY = 0;
	pointerInside = false;
	idlePrevX = 0;
	idlePrevY = 0;
	hasIdlePrev = false;
	ringX = new Float64Array(RING);
	ringY = new Float64Array(RING);
	ringHead = 0;
	ringCount = 0;
	idleHold = 0;
	constructor(canvas) {
		const ctx = canvas.getContext("2d", { alpha: false });
		if (!ctx) throw new Error("Canvas 2D is unavailable");
		this.canvas = canvas;
		this.ctx = ctx;
	}
	start() {
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
	stop() {
		this.running = false;
		cancelAnimationFrame(this.raf);
		this.ro?.disconnect();
		this.ro = null;
		this.unbind();
	}
	clear() {
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
	burst() {
		const settings = this.settings();
		if (settings.frozen) return;
		this.hasPrev = false;
		const turns = 2.4 + Math.random() * 1.6;
		const steps = 56;
		const scale = .18 + Math.random() * .28;
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
	exportPng() {
		return new Promise((resolve, reject) => {
			this.canvas.toBlob((blob) => {
				if (!blob) {
					reject(/* @__PURE__ */ new Error("Export failed"));
					return;
				}
				const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19);
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
	settings() {
		const s = useKaleidoStore.getState();
		return {
			segments: s.segments,
			colorMode: s.colorMode,
			hueShift: s.hueShift,
			brush: s.brush,
			frozen: s.frozen
		};
	}
	loop = (ts) => {
		if (!this.running) return;
		this.raf = requestAnimationFrame(this.loop);
		if (this.lastTs === 0) this.lastTs = ts;
		let dt = (ts - this.lastTs) / 1e3;
		this.lastTs = ts;
		if (dt > .1) dt = .1;
		this.time += dt;
		this.tick(dt);
	};
	tick(dt) {
		const settings = this.settings();
		this.canvas.style.cursor = settings.frozen ? "default" : "none";
		if (!settings.frozen) {
			this.fade(dt);
			this.drainPointer(settings);
			if (this.idleHold > 0) {
				this.idleHold -= dt;
				this.hasIdlePrev = false;
			} else if (!this.pointerInside) this.advanceIdle(dt, settings);
			else this.hasIdlePrev = false;
		}
	}
	fade(dt) {
		const alpha = 1 - Math.pow(.988, dt * 60);
		const { ctx, cssW, cssH } = this;
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = `rgba(${BG_RGB}, ${alpha.toFixed(4)})`;
		ctx.fillRect(0, 0, cssW, cssH);
	}
	drainPointer(settings) {
		if (this.ringCount === 0) return;
		while (this.ringCount > 0) {
			const i = this.ringHead;
			const x = this.ringX[i] ?? 0;
			const y = this.ringY[i] ?? 0;
			this.ringHead = (this.ringHead + 1) % RING;
			this.ringCount -= 1;
			if (this.hasPrev) this.strokeSegment(this.lastPointerX, this.lastPointerY, x, y, settings);
			else {
				this.strokeSegment(x, y, x, y, settings);
				this.hasPrev = true;
			}
			this.lastPointerX = x;
			this.lastPointerY = y;
		}
	}
	advanceIdle(dt, settings) {
		this.idleT += dt;
		const p = this.idlePoint(this.idleT);
		if (this.hasIdlePrev) this.strokeSegment(this.idlePrevX, this.idlePrevY, p.x, p.y, settings);
		this.idlePrevX = p.x;
		this.idlePrevY = p.y;
		this.hasIdlePrev = true;
		this.hasPrev = false;
	}
	idlePoint(t) {
		const k = 3.2 + Math.sin(t * .09) * 1.8;
		const theta = t * .62;
		const wobble = .58 + .28 * Math.sin(t * .11);
		const r = this.maxR * .38 * wobble * Math.cos(k * theta);
		return {
			x: this.cx + Math.cos(theta) * r,
			y: this.cy + Math.sin(theta) * r
		};
	}
	seed() {
		if (this.seeded) return;
		this.seeded = true;
		const settings = {
			...this.settings(),
			frozen: false
		};
		const steps = 240;
		let prev = this.idlePoint(0);
		for (let i = 1; i <= steps; i++) {
			const t = i * .055;
			const p = this.idlePoint(t);
			if (i % 12 === 0) this.fade(1 / 60);
			this.strokeSegment(prev.x, prev.y, p.x, p.y, settings);
			prev = p;
		}
		this.idleT = steps * .055;
		this.idlePrevX = prev.x;
		this.idlePrevY = prev.y;
		this.hasIdlePrev = true;
		this.hasPrev = false;
	}
	strokeSegment(x0, y0, x1, y1, settings) {
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
	stamp(x0, y0, x1, y1, settings) {
		const n = Math.round(settings.segments);
		this.fillCopies(x0, y0, n, this.prevX, this.prevY);
		this.fillCopies(x1, y1, n, this.currX, this.currY);
		const count = n * 2;
		const dx = x1 - this.cx;
		const dy = y1 - this.cy;
		const distNorm = this.maxR <= 0 ? 0 : Math.min(1, Math.hypot(dx, dy) / (this.maxR * .72));
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
	fillCopies(x, y, segments, xs, ys) {
		const { cx, cy } = this;
		const dx = x - cx;
		const dy = y - cy;
		let k = 0;
		for (let i = 0; i < segments; i++) {
			const a = i * Math.PI * 2 / segments;
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
	resize = () => {
		const rect = (this.canvas.parentElement ?? this.canvas).getBoundingClientRect();
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const w = Math.max(1, Math.round(rect.width));
		const h = Math.max(1, Math.round(rect.height));
		const bw = Math.round(w * dpr);
		const bh = Math.round(h * dpr);
		if (this.canvas.width === bw && this.canvas.height === bh && this.cssW === w) return;
		let snapshot = null;
		if (this.canvas.width > 0 && this.canvas.height > 0 && this.seeded) {
			snapshot = document.createElement("canvas");
			snapshot.width = this.canvas.width;
			snapshot.height = this.canvas.height;
			snapshot.getContext("2d")?.drawImage(this.canvas, 0, 0);
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
	pushSample(x, y) {
		if (this.ringCount === RING) {
			this.ringHead = (this.ringHead + 1) % RING;
			this.ringCount -= 1;
		}
		const i = (this.ringHead + this.ringCount) % RING;
		this.ringX[i] = x;
		this.ringY[i] = y;
		this.ringCount += 1;
	}
	localPoint(e) {
		const r = this.canvas.getBoundingClientRect();
		return {
			x: e.clientX - r.left,
			y: e.clientY - r.top
		};
	}
	onPointerDown = (e) => {
		if (e.button !== 0 && e.pointerType === "mouse") return;
		this.canvas.setPointerCapture(e.pointerId);
		const p = this.localPoint(e);
		this.pointerInside = true;
		this.hasPrev = false;
		this.hasIdlePrev = false;
		this.pushSample(p.x, p.y);
		e.preventDefault();
	};
	onPointerMove = (e) => {
		const p = this.localPoint(e);
		if (e.pointerType === "mouse" || e.pointerType === "pen" || e.buttons > 0) {
			this.pointerInside = true;
			this.hasIdlePrev = false;
			this.pushSample(p.x, p.y);
		}
	};
	onPointerUp = (e) => {
		if (this.canvas.hasPointerCapture(e.pointerId)) this.canvas.releasePointerCapture(e.pointerId);
		if (e.pointerType !== "mouse") {
			this.pointerInside = false;
			this.hasPrev = false;
		}
	};
	onPointerEnter = (e) => {
		if (e.pointerType === "mouse" || e.pointerType === "pen") {
			this.pointerInside = true;
			this.hasPrev = false;
			this.hasIdlePrev = false;
		}
	};
	onPointerLeave = () => {
		this.pointerInside = false;
		this.hasPrev = false;
	};
	onLostCapture = () => {
		this.pointerInside = false;
		this.hasPrev = false;
	};
	bind() {
		const el = this.canvas;
		el.addEventListener("pointerdown", this.onPointerDown);
		el.addEventListener("pointermove", this.onPointerMove);
		el.addEventListener("pointerup", this.onPointerUp);
		el.addEventListener("pointercancel", this.onPointerUp);
		el.addEventListener("pointerenter", this.onPointerEnter);
		el.addEventListener("pointerleave", this.onPointerLeave);
		el.addEventListener("lostpointercapture", this.onLostCapture);
	}
	unbind() {
		const el = this.canvas;
		el.removeEventListener("pointerdown", this.onPointerDown);
		el.removeEventListener("pointermove", this.onPointerMove);
		el.removeEventListener("pointerup", this.onPointerUp);
		el.removeEventListener("pointercancel", this.onPointerUp);
		el.removeEventListener("pointerenter", this.onPointerEnter);
		el.removeEventListener("pointerleave", this.onPointerLeave);
		el.removeEventListener("lostpointercapture", this.onLostCapture);
	}
};
function KaleidoscopeCanvas({ engineRef }) {
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const engine = new KaleidoEngine(canvas);
		engineRef.current = engine;
		engine.start();
		return () => {
			engine.stop();
			engineRef.current = null;
		};
	}, [engineRef]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: "kaleido-canvas",
		"aria-label": "万花筒画布，移动指针绘制对称图案"
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium select-none whitespace-nowrap transition-[opacity,transform,background-color,color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90",
			outline: "bg-surface text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "bg-transparent text-fg hover:bg-surface-2",
			quiet: "bg-transparent text-muted hover:bg-surface-2 hover:text-fg"
		},
		size: {
			default: "h-11 px-4 rounded-md text-sm",
			sm: "h-10 px-3 rounded-sm text-sm",
			icon: "size-11 rounded-md",
			chip: "h-10 px-3.5 rounded-full text-sm"
		}
	},
	defaultVariants: {
		variant: "outline",
		size: "default"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Slider({ value, min, max, step = 1, label, display, onValueChange, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex min-w-0 items-center gap-3", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 text-xs font-medium tracking-wide text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
				className: "relative flex h-11 w-full min-w-16 touch-none items-center select-none",
				value: [value],
				min,
				max,
				step,
				onValueChange: (next) => {
					const v = next[0];
					if (typeof v === "number") onValueChange(v);
				},
				"aria-label": label,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
					className: "relative h-1 w-full grow overflow-hidden rounded-full bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent/80" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-accent shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-6 shrink-0 text-right font-mono text-xs tabular-nums text-fg",
				children: display
			})
		]
	});
}
var SWATCH = {
	prism: "bg-swatch-prism",
	ember: "bg-swatch-ember",
	aurora: "bg-swatch-aurora",
	ink: "bg-swatch-ink",
	ocean: "bg-swatch-ocean",
	glass: "bg-swatch-glass"
};
function KaleidoscopeHud({ engineRef }) {
	const segments = useKaleidoStore((s) => s.segments);
	const colorMode = useKaleidoStore((s) => s.colorMode);
	const brush = useKaleidoStore((s) => s.brush);
	const frozen = useKaleidoStore((s) => s.frozen);
	const setSegments = useKaleidoStore((s) => s.setSegments);
	const setColorMode = useKaleidoStore((s) => s.setColorMode);
	const setBrush = useKaleidoStore((s) => s.setBrush);
	const toggleFrozen = useKaleidoStore((s) => s.toggleFrozen);
	const randomize = useKaleidoStore((s) => s.randomize);
	const [hint, setHint] = (0, import_react.useState)(true);
	const [status, setStatus] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const hide = () => setHint(false);
		window.addEventListener("pointerdown", hide, { once: true });
		window.addEventListener("pointermove", hide, { once: true });
		return () => {
			window.removeEventListener("pointerdown", hide);
			window.removeEventListener("pointermove", hide);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const flashMsg = (message) => {
			setStatus(message);
			window.setTimeout(() => {
				setStatus((current) => current === message ? null : current);
			}, 1600);
		};
		const onKey = (e) => {
			const target = e.target;
			if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
			const state = useKaleidoStore.getState();
			if (e.code === "Space") {
				e.preventDefault();
				state.toggleFrozen();
			} else if (e.code === "KeyR") {
				e.preventDefault();
				state.randomize();
				requestAnimationFrame(() => engineRef.current?.burst());
				flashMsg("已随机");
			} else if (e.code === "KeyE") {
				e.preventDefault();
				engineRef.current?.exportPng().then(() => flashMsg("已导出图像")).catch(() => flashMsg("导出失败"));
			} else if (e.code === "KeyC") {
				e.preventDefault();
				engineRef.current?.clear();
				flashMsg("已清空");
			} else if (e.code === "BracketLeft" || e.code === "Minus") {
				e.preventDefault();
				state.setSegments(state.segments - 1);
			} else if (e.code === "BracketRight" || e.code === "Equal") {
				e.preventDefault();
				state.setSegments(state.segments + 1);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [engineRef]);
	function flash(message) {
		setStatus(message);
		window.setTimeout(() => {
			setStatus((current) => current === message ? null : current);
		}, 1600);
	}
	function handleRandomize() {
		randomize();
		requestAnimationFrame(() => engineRef.current?.burst());
		flash("已随机");
	}
	function handleClear() {
		engineRef.current?.clear();
		flash("已清空");
	}
	async function handleExport() {
		try {
			await engineRef.current?.exportPng();
			flash("已导出图像");
		} catch {
			flash("导出失败");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-shell pointer-events-none absolute inset-0 z-10 flex flex-col justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stagger-item font-display text-3xl leading-tight tracking-display text-fg italic sm:text-4xl",
				children: "万花筒"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stagger-item mt-1 max-w-xs text-sm leading-snug text-muted",
				children: "移动指针，镜像成对称的光"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-end gap-2",
				children: [frozen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pointer-events-none inline-flex h-8 items-center rounded-full bg-accent px-3 text-xs font-medium tracking-wide text-accent-fg",
					children: "已冻结"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("min-h-5 text-xs text-muted transition-opacity duration-[var(--motion-quick)] ease-[var(--ease-out)]", status ? "opacity-100" : "opacity-0"),
					"aria-live": "polite",
					children: status ?? ""
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-stretch gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("text-center text-xs text-subtle transition-opacity duration-[var(--motion-slow)] ease-[var(--ease-out)]", hint ? "opacity-100" : "opacity-0"),
				children: "移动或点按画面作画 · 空格冻结 · R 随机 · E 导出"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto mx-auto w-full max-w-3xl rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 lg:flex-row lg:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex min-w-0 snap-x gap-1.5 overflow-x-auto pb-0.5",
							role: "radiogroup",
							"aria-label": "颜色模式",
							children: COLOR_MODES.map((mode) => {
								const active = mode.id === colorMode;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									role: "radio",
									"aria-checked": active,
									onClick: () => setColorMode(mode.id),
									className: cn("inline-flex h-10 shrink-0 snap-start items-center gap-2 rounded-full px-3 text-sm transition-[background-color,color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40", active ? "bg-surface-2 text-fg shadow-[var(--shadow-border)]" : "text-muted hover:bg-surface-2 hover:text-fg"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", SWATCH[mode.id]) }), mode.label]
								}, mode.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden h-8 w-px shrink-0 bg-border lg:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid min-w-0 flex-1 grid-cols-2 gap-x-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								label: "段数",
								display: String(Math.round(segments)),
								value: segments,
								min: 3,
								max: 24,
								step: 1,
								onValueChange: setSegments
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								label: "笔触",
								display: String(Math.round(brush)),
								value: brush,
								min: 3,
								max: 18,
								step: .5,
								onValueChange: setBrush
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: frozen ? "primary" : "outline",
							onClick: toggleFrozen,
							"aria-pressed": frozen,
							title: "空格",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snowflake, {
								className: "size-4",
								strokeWidth: 1.75
							}), frozen ? "继续" : "冻结"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: handleRandomize,
							title: "R",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, {
								className: "size-4",
								strokeWidth: 1.75
							}), "随机"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => void handleExport(),
							title: "E",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
								className: "size-4",
								strokeWidth: 1.75
							}), "导出"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "quiet",
							onClick: handleClear,
							title: "C",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, {
								className: "size-4",
								strokeWidth: 1.75
							}), "清空"]
						})
					]
				})]
			})]
		})]
	});
}
function Home() {
	const engineRef = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh min-h-dvh overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KaleidoscopeCanvas, { engineRef }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vignette",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KaleidoscopeHud, { engineRef })
		]
	});
}
//#endregion
export { Home as component };
