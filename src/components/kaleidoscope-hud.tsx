import { Download, Dices, Eraser, Snowflake } from "lucide-react";
import { useEffect, useState, type MutableRefObject } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/cn";
import type { KaleidoEngine } from "@/lib/kaleidoscope/engine";
import { useKaleidoStore } from "@/lib/kaleidoscope/store";
import {
  BRUSH_MAX,
  BRUSH_MIN,
  COLOR_MODES,
  SEGMENTS_MAX,
  SEGMENTS_MIN,
  type ColorMode,
} from "@/lib/kaleidoscope/types";

const SWATCH: Record<ColorMode, string> = {
  prism: "bg-swatch-prism",
  ember: "bg-swatch-ember",
  aurora: "bg-swatch-aurora",
  ink: "bg-swatch-ink",
  ocean: "bg-swatch-ocean",
  glass: "bg-swatch-glass",
};

type Props = {
  engineRef: MutableRefObject<KaleidoEngine | null>;
};

export function KaleidoscopeHud({ engineRef }: Props) {
  const segments = useKaleidoStore((s) => s.segments);
  const colorMode = useKaleidoStore((s) => s.colorMode);
  const brush = useKaleidoStore((s) => s.brush);
  const frozen = useKaleidoStore((s) => s.frozen);
  const setSegments = useKaleidoStore((s) => s.setSegments);
  const setColorMode = useKaleidoStore((s) => s.setColorMode);
  const setBrush = useKaleidoStore((s) => s.setBrush);
  const toggleFrozen = useKaleidoStore((s) => s.toggleFrozen);
  const randomize = useKaleidoStore((s) => s.randomize);

  const [hint, setHint] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const hide = () => setHint(false);
    window.addEventListener("pointerdown", hide, { once: true });
    window.addEventListener("pointermove", hide, { once: true });
    return () => {
      window.removeEventListener("pointerdown", hide);
      window.removeEventListener("pointermove", hide);
    };
  }, []);

  useEffect(() => {
    const flashMsg = (message: string) => {
      setStatus(message);
      window.setTimeout(() => {
        setStatus((current) => (current === message ? null : current));
      }, 1600);
    };
    const onKey = (e: KeyboardEvent) => {
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
        void engineRef.current
          ?.exportPng()
          .then(() => flashMsg("已导出图像"))
          .catch(() => flashMsg("导出失败"));
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

  function flash(message: string) {
    setStatus(message);
    window.setTimeout(() => {
      setStatus((current) => (current === message ? null : current));
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

  return (
    <div className="hud-shell pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="stagger-item font-display text-3xl leading-tight tracking-display text-fg italic sm:text-4xl">
            万花筒
          </p>
          <p className="stagger-item mt-1 max-w-xs text-sm leading-snug text-muted">
            移动指针，镜像成对称的光
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {frozen ? (
            <span className="pointer-events-none inline-flex h-8 items-center rounded-full bg-accent px-3 text-xs font-medium tracking-wide text-accent-fg">
              已冻结
            </span>
          ) : null}
          <span
            className={cn(
              "min-h-5 text-xs text-muted transition-opacity duration-[var(--motion-quick)] ease-[var(--ease-out)]",
              status ? "opacity-100" : "opacity-0",
            )}
            aria-live="polite"
          >
            {status ?? ""}
          </span>
        </div>
      </header>

      <div className="flex flex-col items-stretch gap-3">
        <p
          className={cn(
            "text-center text-xs text-subtle transition-opacity duration-[var(--motion-slow)] ease-[var(--ease-out)]",
            hint ? "opacity-100" : "opacity-0",
          )}
        >
          移动或点按画面作画 · 空格冻结 · R 随机 · E 导出
        </p>

        <div className="pointer-events-auto mx-auto w-full max-w-3xl rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div
              className="flex min-w-0 snap-x gap-1.5 overflow-x-auto pb-0.5"
              role="radiogroup"
              aria-label="颜色模式"
            >
              {COLOR_MODES.map((mode) => {
                const active = mode.id === colorMode;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setColorMode(mode.id)}
                    className={cn(
                      "inline-flex h-10 shrink-0 snap-start items-center gap-2 rounded-full px-3 text-sm transition-[background-color,color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                      active
                        ? "bg-surface-2 text-fg shadow-[var(--shadow-border)]"
                        : "text-muted hover:bg-surface-2 hover:text-fg",
                    )}
                  >
                    <span className={cn("size-2 rounded-full", SWATCH[mode.id])} />
                    {mode.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden h-8 w-px shrink-0 bg-border lg:block" />

            <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-4">
              <Slider
                label="段数"
                display={String(Math.round(segments))}
                value={segments}
                min={SEGMENTS_MIN}
                max={SEGMENTS_MAX}
                step={1}
                onValueChange={setSegments}
              />
              <Slider
                label="笔触"
                display={String(Math.round(brush))}
                value={brush}
                min={BRUSH_MIN}
                max={BRUSH_MAX}
                step={0.5}
                onValueChange={setBrush}
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant={frozen ? "primary" : "outline"}
              onClick={toggleFrozen}
              aria-pressed={frozen}
              title="空格"
            >
              <Snowflake className="size-4" strokeWidth={1.75} />
              {frozen ? "继续" : "冻结"}
            </Button>
            <Button variant="outline" onClick={handleRandomize} title="R">
              <Dices className="size-4" strokeWidth={1.75} />
              随机
            </Button>
            <Button variant="outline" onClick={() => void handleExport()} title="E">
              <Download className="size-4" strokeWidth={1.75} />
              导出
            </Button>
            <Button variant="quiet" onClick={handleClear} title="C">
              <Eraser className="size-4" strokeWidth={1.75} />
              清空
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
