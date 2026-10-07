import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { KaleidoscopeCanvas } from "@/components/kaleidoscope-canvas";
import { KaleidoscopeHud } from "@/components/kaleidoscope-hud";
import type { KaleidoEngine } from "@/lib/kaleidoscope/engine";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const engineRef = useRef<KaleidoEngine | null>(null);

  return (
    <main className="relative h-dvh min-h-dvh overflow-hidden bg-bg text-fg">
      <KaleidoscopeCanvas engineRef={engineRef} />
      <div className="vignette" aria-hidden="true" />
      <KaleidoscopeHud engineRef={engineRef} />
    </main>
  );
}
