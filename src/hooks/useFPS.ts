import { useState, useEffect } from "react";

export function useFPS() {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    let frameId: number;

    function measure() {
      const time = performance.now();
      frames++;
      if (time >= lastTime + 1000) {
        setFps(frames);
        frames = 0;
        lastTime = time;
      }
      frameId = requestAnimationFrame(measure);
    }
    frameId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frameId);
  }, []);
  return fps;
}
