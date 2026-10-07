import { useEffect, useRef, type MutableRefObject } from "react";
import { KaleidoEngine } from "@/lib/kaleidoscope/engine";

type Props = {
  engineRef: MutableRefObject<KaleidoEngine | null>;
};

export function KaleidoscopeCanvas({ engineRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

  return (
    <canvas
      ref={canvasRef}
      className="kaleido-canvas"
      aria-label="万花筒画布，移动指针绘制对称图案"
    />
  );
}
