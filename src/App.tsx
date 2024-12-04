import { Canvas } from "@react-three/fiber";
import { IDE } from "./widgets/ide";
import vertexShader from "@/shaders/sample/vertex.glsl";
import fragmentShader from "@/shaders/sample/fragment.glsl";
import { Plane } from "@react-three/drei";
import { useConfig } from "./store/config";
import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { List, MonitorPlay } from "lucide-react";

export const App: React.FC = () => {
  const { colors } = useConfig();

  const styleColors = useMemo(() => {
    return {
      "--color-main": colors.main,
      "--color-secondary": colors.secondary,
      "--color-border": colors.border,
      "--color-text": colors.text,
    } as React.CSSProperties;
  }, [colors]);

  return (
    <div
      className="relative w-screen h-screen bg-no-repeat bg-cover bg-center"
      style={styleColors}
    >
      <Canvas
        className="absolute inset-0 z-0"
        orthographic
        camera={{ left: 0, right: 1, top: 1, bottom: 0, near: 0.1, far: 100 }}
      >
        <Plane position={[0.5, 0.5, 0]}>
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
          />
        </Plane>
      </Canvas>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg z-10" />
      <div
        className="absolute left-0 top-0 h-full w-14 z-30 bg-[var(--color-secondary)] flex flex-col justify-between items-center"
        style={styleColors}
      >
        <div className="pt-4 flex flex-col items-center gap-4">
          <Tooltip disableHoverableContent>
            <TooltipTrigger className="cursor-pointer hover:bg-[var(--color-main)] w-10 h-10 rounded-full">
              <List className="stroke-[var(--color-text)] m-auto" size={24} />
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
            >
              List
            </TooltipContent>
          </Tooltip>
          <Tooltip disableHoverableContent>
            <TooltipTrigger className="cursor-pointer hover:bg-[var(--color-main)] w-10 h-10 rounded-full">
              <MonitorPlay
                className="stroke-[var(--color-text)] m-auto"
                size={24}
              />
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
            >
              Playground
            </TooltipContent>
          </Tooltip>
        </div>
        <Tooltip disableHoverableContent>
          <TooltipTrigger asChild>
            <div className="mb-4 rounded-full w-10 h-10 bg-[var(--color-main)] text-[var(--color-text)] flex items-center justify-center cursor-pointer">
              G
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
          >
            Guest mode
          </TooltipContent>
        </Tooltip>
      </div>
      <IDE className="absolute top-10 bottom-10 left-20 right-20 z-20" />
    </div>
  );
};
