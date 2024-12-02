import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Scene } from "@/components/scene";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/store/slice";
import { GLSLEditor } from "@/components/glsl-editor";

export const IDE: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const {
    current: { vertexShader, fragmentShader },
    updateVertexShader,
    updateFragmentShader,
  } = useStore();
  const [fileName, setFileName] = useState<"fragment" | "vertex">("vertex");

  return (
    <div
      className={cn("bg-black", className)}
      style={
        {
          ...props.style,
          "--color-main": "#1E1E1E",
          "--color-secondary": "#000000",
          "--color-border": "#2e2e2e",
        } as React.CSSProperties
      }
      {...props}
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div className="flex items-center justify-start">
            <div
              className={cn(
                "text-xs text-primary-foreground bg-[var(--color-secondary)] font-normal h-8 px-2 leading-8 cursor-pointer border-b border-[var(--color-border)]",
                {
                  "bg-[var(--color-main)] border-[var(--color-main)] cursor-default":
                    fileName === "vertex",
                }
              )}
              onClick={() => setFileName("vertex")}
            >
              vertex.glsl
            </div>
            <Separator
              orientation="vertical"
              className="h-8 bg-[var(--color-border)]"
            />
            <div
              className={cn(
                "text-xs text-primary-foreground bg-[var(--color-secondary)] font-normal h-8 px-2 leading-8 cursor-pointer border-b border-[var(--color-border)]",
                {
                  "bg-[var(--color-main)] border-[var(--color-main)] cursor-default":
                    fileName === "fragment",
                }
              )}
              onClick={() => setFileName("fragment")}
            >
              fragment.glsl
            </div>
            <Separator
              orientation="vertical"
              className="h-8 bg-[var(--color-border)]"
            />
            <div className="grow border-b border-[var(--color-border)] bg-[var(--color-secondary)] h-8" />
          </div>
          <GLSLEditor
            value={fileName === "vertex" ? vertexShader : fragmentShader}
            onChange={(value) => {
              if (fileName === "vertex") updateVertexShader(value ?? "");
              else updateFragmentShader(value ?? "");
            }}
          />
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-[var(--color-border)]" />
        <ResizablePanel>
          <Canvas
            orthographic
            camera={{
              left: 0,
              right: 1,
              top: 1,
              bottom: 0,
              near: 0.1,
              far: 100,
            }}
          >
            <Scene
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
            />
          </Canvas>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
