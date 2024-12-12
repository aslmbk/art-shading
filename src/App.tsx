import { Canvas } from "@react-three/fiber";
import { IDE } from "./widgets/ide";
import { Plane } from "@react-three/drei";
import { useConfig } from "./store/config";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { MonitorPlay, List as ListIcon } from "lucide-react";
import { List } from "./widgets/list";
import { useData } from "./store/data";
import * as THREE from "three";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./components/ui/dialog";
import { Authorization } from "./components/authorization";
import { useAuth } from "./context/auth-context";

export const App: React.FC = () => {
  const { colors } = useConfig();
  const mainTexture = useData((state) => state.mainTexture);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const { isAuthenticated, user } = useAuth();
  const adminMode = isAuthenticated && user?.token;

  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (materialRef.current && mainTexture) {
      materialRef.current.map = mainTexture;
      materialRef.current.needsUpdate = true;
    }
  }, [mainTexture]);

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
          <meshBasicMaterial ref={materialRef} map={mainTexture} />
        </Plane>
      </Canvas>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-10" />
      <div
        className="absolute left-0 top-0 h-full w-14 z-30 bg-[var(--color-secondary)] flex flex-col justify-between items-center"
        style={styleColors}
      >
        <div className="pt-4 flex flex-col items-center gap-4">
          <Tooltip disableHoverableContent>
            <TooltipTrigger
              className="cursor-pointer hover:bg-[var(--color-main)] w-10 h-10 rounded-full disabled:opacity-50"
              disabled={showList}
              onClick={() => setShowList(true)}
            >
              <ListIcon
                className="stroke-[var(--color-text)] m-auto"
                size={24}
              />
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
            >
              List
            </TooltipContent>
          </Tooltip>
          <Tooltip disableHoverableContent>
            <TooltipTrigger
              className="cursor-pointer hover:bg-[var(--color-main)] w-10 h-10 rounded-full disabled:opacity-50"
              disabled={!showList}
              onClick={() => setShowList(false)}
            >
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

        <Dialog>
          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <DialogTrigger className="mb-4 rounded-full w-10 h-10 bg-[var(--color-main)] text-[var(--color-text)] flex items-center justify-center cursor-pointer">
                G
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
            >
              Guest mode
            </TooltipContent>
          </Tooltip>
          <DialogContent
            className="w-fit !rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
            closeClassName="text-[var(--color-text)] hover:bg-[var(--color-main)] rounded-none border-0 focus:ring-0 focus:ring-offset-0"
            style={styleColors}
          >
            <DialogHeader>
              <DialogTitle>
                {adminMode ? "You are administrator" : "Authorization"}
              </DialogTitle>
              <DialogDescription>
                {adminMode ? "" : "Administrator login and password"}
              </DialogDescription>
            </DialogHeader>
            <Authorization />
          </DialogContent>
        </Dialog>
      </div>
      {showList ? (
        <List className="absolute top-10 bottom-10 left-20 right-20 z-20" />
      ) : (
        <IDE className="absolute top-10 bottom-10 left-20 right-20 z-20" />
      )}
    </div>
  );
};
