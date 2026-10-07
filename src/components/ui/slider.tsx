import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/cn";

type SliderProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  label: string;
  display: string;
  onValueChange: (value: number) => void;
  className?: string;
};

export function Slider({
  value,
  min,
  max,
  step = 1,
  label,
  display,
  onValueChange,
  className,
}: SliderProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <span className="shrink-0 text-xs font-medium tracking-wide text-muted">{label}</span>
      <SliderPrimitive.Root
        className="relative flex h-11 w-full min-w-16 touch-none items-center select-none"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(next) => {
          const v = next[0];
          if (typeof v === "number") onValueChange(v);
        }}
        aria-label={label}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-surface-2">
          <SliderPrimitive.Range className="absolute h-full bg-accent/80" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-4 rounded-full bg-accent shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" />
      </SliderPrimitive.Root>
      <span className="w-6 shrink-0 text-right font-mono text-xs tabular-nums text-fg">
        {display}
      </span>
    </div>
  );
}
