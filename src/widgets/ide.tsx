import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Scene } from "@/components/scene";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { formatCode, GLSLEditor } from "@/components/glsl-editor";
import { useConfig } from "@/store/config";
import { codeSnippets, themes } from "@/lib/constants";
import {
  ALargeSmall,
  ChartNoAxesGantt,
  Code,
  Copy,
  IndentIncrease,
  Palette,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textures } from "@/components/textures";
import { FPSMeter } from "@/components/fps-meter";

export const IDE: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const theme = useConfig((state) => state.theme);
  const tabSize = useConfig((state) => state.tabSize);
  const fontSize = useConfig((state) => state.fontSize);
  const setTabSize = useConfig((state) => state.setTabSize);
  const setFontSize = useConfig((state) => state.setFontSize);
  const setTheme = useConfig((state) => state.setTheme);
  const colors = useConfig((state) => state.colors);

  const [fileType, setFileType] = useState<"fragment" | "vertex" | "textures">(
    "fragment"
  );
  const [copiedSnippet, setCopiedSnippet] = useState<string>("");

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
      className={cn("bg-[var(--color-secondary)]", className)}
      {...props}
      style={{
        ...props.style,
        ...styleColors,
      }}
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start grow">
              <div
                className={cn(
                  "text-xs text-[var(--color-text)] bg-[var(--color-secondary)] font-normal h-8 px-2 leading-8 cursor-pointer border-b border-[var(--color-border)]",
                  {
                    "bg-[var(--color-main)] border-[var(--color-main)] cursor-default":
                      fileType === "vertex",
                  }
                )}
                onClick={() => setFileType("vertex")}
              >
                vertex.glsl
              </div>
              <Separator
                orientation="vertical"
                className="h-8 bg-[var(--color-border)]"
              />
              <div
                className={cn(
                  "text-xs text-[var(--color-text)] bg-[var(--color-secondary)] font-normal h-8 px-2 leading-8 cursor-pointer border-b border-[var(--color-border)]",
                  {
                    "bg-[var(--color-main)] border-[var(--color-main)] cursor-default":
                      fileType === "fragment",
                  }
                )}
                onClick={() => setFileType("fragment")}
              >
                fragment.glsl
              </div>
              <Separator
                orientation="vertical"
                className="h-8 bg-[var(--color-border)]"
              />
              <div
                className={cn(
                  "text-xs text-[var(--color-text)] bg-[var(--color-secondary)] font-normal h-8 px-2 leading-8 cursor-pointer border-b border-[var(--color-border)]",
                  {
                    "bg-[var(--color-main)] border-[var(--color-main)] cursor-default":
                      fileType === "textures",
                  }
                )}
                onClick={() => setFileType("textures")}
              >
                textures
              </div>
              <Separator
                orientation="vertical"
                className="h-8 bg-[var(--color-border)]"
              />
              <div className="grow border-b border-[var(--color-border)] bg-[var(--color-secondary)] h-8" />
            </div>

            <div className="flex items-center justify-center">
              <Tooltip disableHoverableContent>
                <TooltipTrigger
                  className="w-8 h-8 rounded-none hover:bg-[var(--color-main)] border border-[var(--color-border)] border-t-0"
                  onClick={() => formatCode(fileType as "vertex" | "fragment")}
                >
                  <ChartNoAxesGantt
                    className="stroke-[var(--color-text)] m-auto"
                    size={20}
                    strokeWidth={1.5}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
                >
                  Format code (Ctrl+Shift+F or Cmd+Shift+F)
                </TooltipContent>
              </Tooltip>

              <Popover>
                <Tooltip disableHoverableContent>
                  <TooltipTrigger asChild>
                    <PopoverTrigger className="w-8 h-8 rounded-none hover:bg-[var(--color-main)] border border-[var(--color-border)] border-t-0 border-l-0">
                      <IndentIncrease
                        className="stroke-[var(--color-text)] m-auto"
                        size={20}
                        strokeWidth={1.5}
                      />
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
                  >
                    Tab size
                  </TooltipContent>
                </Tooltip>
                <PopoverContent
                  className="p-1 w-fit rounded-none bg-[var(--color-secondary)] border-[var(--color-border)]"
                  style={styleColors}
                >
                  <ToggleGroup
                    type="single"
                    value={String(tabSize)}
                    onValueChange={(value) =>
                      setTabSize(Number(value) as typeof tabSize)
                    }
                    className="bg-[var(--color-secondary)] border-[var(--color-border)]"
                  >
                    <ToggleGroupItem
                      className="text-[var(--color-text)] data-[state=on]:bg-[var(--color-main)] data-[state=on]:text-[var(--color-text)] rounded-none p-0 h-7 w-7 min-w-7 text-xs"
                      value="2"
                    >
                      2
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="text-[var(--color-text)] data-[state=on]:bg-[var(--color-main)] data-[state=on]:text-[var(--color-text)] rounded-none p-0 h-7 w-7 min-w-7 text-xs"
                      value="4"
                    >
                      4
                    </ToggleGroupItem>
                  </ToggleGroup>
                </PopoverContent>
              </Popover>

              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger className="w-8 h-8 rounded-none hover:bg-[var(--color-main)] border border-[var(--color-border)] border-t-0 border-l-0">
                      <ALargeSmall
                        className="stroke-[var(--color-text)] m-auto"
                        size={20}
                        strokeWidth={1.5}
                      />
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
                  >
                    Text size
                  </TooltipContent>
                </Tooltip>
                <PopoverContent
                  className="p-1 w-fit rounded-none bg-[var(--color-secondary)] border-[var(--color-border)]"
                  style={styleColors}
                >
                  <ToggleGroup
                    type="single"
                    value={String(fontSize)}
                    onValueChange={(value) =>
                      setFontSize(Number(value) as typeof fontSize)
                    }
                    className="bg-[var(--color-secondary)] border-[var(--color-border)]"
                  >
                    <ToggleGroupItem
                      className="text-[var(--color-text)] data-[state=on]:bg-[var(--color-main)] data-[state=on]:text-[var(--color-text)] rounded-none p-0 h-7 w-7 min-w-7 text-xs"
                      value="10"
                    >
                      10
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="text-[var(--color-text)] data-[state=on]:bg-[var(--color-main)] data-[state=on]:text-[var(--color-text)] rounded-none p-0 h-7 w-7 min-w-7 text-xs"
                      value="12"
                    >
                      12
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="text-[var(--color-text)] data-[state=on]:bg-[var(--color-main)] data-[state=on]:text-[var(--color-text)] rounded-none p-0 h-7 w-7 min-w-7 text-xs"
                      value="14"
                    >
                      14
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="text-[var(--color-text)] data-[state=on]:bg-[var(--color-main)] data-[state=on]:text-[var(--color-text)] rounded-none p-0 h-7 w-7 min-w-7 text-xs"
                      value="16"
                    >
                      16
                    </ToggleGroupItem>
                  </ToggleGroup>
                </PopoverContent>
              </Popover>

              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger className="w-8 h-8 rounded-none hover:bg-[var(--color-main)] border border-[var(--color-border)] border-t-0 border-l-0">
                      <Palette
                        className="stroke-[var(--color-text)] m-auto"
                        size={20}
                        strokeWidth={1.5}
                      />
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
                  >
                    Theme
                  </TooltipContent>
                </Tooltip>
                <PopoverContent
                  className="p-0 w-fit rounded-none bg-[var(--color-secondary)] border-[var(--color-border)]"
                  style={styleColors}
                >
                  <Select
                    value={theme}
                    onValueChange={(value) => setTheme(value as typeof theme)}
                  >
                    <SelectTrigger className="w-40 h-8 rounded-none bg-transparent text-[var(--color-text)] border-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      className="rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
                      style={styleColors}
                    >
                      {Object.keys(themes).map((key) => (
                        <SelectItem key={key} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </PopoverContent>
              </Popover>

              <Dialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger className="w-8 h-8 rounded-none hover:bg-[var(--color-main)] border-b border-[var(--color-border)]">
                      <Code
                        className="stroke-[var(--color-text)] m-auto"
                        size={20}
                        strokeWidth={1.5}
                      />
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
                  >
                    Code snippets
                  </TooltipContent>
                </Tooltip>
                <DialogContent
                  className="w-fit !rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text)]"
                  closeClassName="text-[var(--color-text)] hover:bg-[var(--color-main)] rounded-none border-0 focus:ring-0 focus:ring-offset-0"
                  style={styleColors}
                >
                  <DialogHeader>
                    <DialogTitle>Code pieces</DialogTitle>
                    <DialogDescription>
                      Copy and use in the code
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-2">
                    {codeSnippets.map((snippet) => (
                      <div
                        key={snippet}
                        className="text-xs bg-[var(--color-main)] border border-[var(--color-border)] pl-2 flex items-center justify-between w-96 h-8"
                      >
                        {snippet}
                        <div className="border-l border-[var(--color-border)] h-full px-2 flex items-center justify-center">
                          <Copy
                            className={cn(
                              "stroke-[var(--color-text)] cursor-pointer w-4 h-4",
                              {
                                "opacity-20": copiedSnippet === snippet,
                              }
                            )}
                            onClick={() => {
                              navigator.clipboard.writeText(snippet);
                              setCopiedSnippet(snippet);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="relative grow">
            {fileType === "textures" ? (
              <Textures className="absolute inset-0 bg-[var(--color-main)]" />
            ) : (
              <GLSLEditor fileType={fileType} />
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-[var(--color-border)]" />
        <ResizablePanel className="relative">
          <FPSMeter className="absolute top-0 right-0 z-10 bg-black opacity-10 text-[var(--color-text)] hover:opacity-90 px-2 py-0.5" />
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
            <Scene />
          </Canvas>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
