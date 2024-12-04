import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { cn, lightenColor } from "@/lib/utils";
import { Scene } from "@/components/scene";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { useData } from "@/store/data";
import { GLSLEditor } from "@/components/glsl-editor";
import { useConfig } from "@/store/config";
import { codeSnippets, themes, themesSettings } from "@/lib/constants";
import { Button } from "@/components/ui/button";
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

export const IDE: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const {
    current: { vertexShader, fragmentShader },
    updateVertexShader,
    updateFragmentShader,
  } = useData();
  const { theme, tabSize, setTabSize, fontSize, setFontSize, setTheme } =
    useConfig();

  const [fileName, setFileName] = useState<"fragment" | "vertex" | "textures">(
    "fragment"
  );
  const [copiedSnippet, setCopiedSnippet] = useState<string>("");
  const value =
    fileName === "vertex"
      ? vertexShader
      : fileName === "fragment"
      ? fragmentShader
      : "";
  const updateValue =
    fileName === "vertex" ? updateVertexShader : updateFragmentShader;

  const { main, secondary, border } = useMemo(() => {
    const color = themesSettings[theme]?.background ?? "#1e1e1e";
    return {
      main: color,
      secondary: lightenColor(color, -64),
      border: lightenColor(color, 64),
    };
  }, [theme]);

  const format = useCallback(() => {
    const text = value;
    const lines = text.split("\n").map((line) => line.trim());
    let indentLevel = 0;

    // Filter out consecutive empty lines
    const filteredLines: string[] = [];
    let lastLineEmpty = false;

    lines.forEach((line) => {
      const isEmpty = line.length === 0;
      if (!(isEmpty && lastLineEmpty)) {
        filteredLines.push(line);
      }
      lastLineEmpty = isEmpty;
    });

    const formattedLines = filteredLines.map((line) => {
      if (line.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1);
      const indented = " ".repeat(indentLevel * tabSize) + line;
      if (line.endsWith("{")) indentLevel++;
      return indented;
    });

    const formatted = formattedLines.join("\n");
    if (formatted !== text) {
      updateValue(formatted);
    }
  }, [tabSize, updateValue, value]);

  useEffect(() => {
    format();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabSize, fileName]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        format();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [format]);

  return (
    <div
      className={cn("bg-[var(--color-secondary)]", className)}
      style={
        {
          ...props.style,
          "--color-main": main,
          "--color-secondary": secondary,
          "--color-border": border,
        } as React.CSSProperties
      }
      {...props}
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start grow">
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
              <div
                className={cn(
                  "text-xs text-primary-foreground bg-[var(--color-secondary)] font-normal h-8 px-2 leading-8 cursor-pointer border-b border-[var(--color-border)]",
                  {
                    "bg-[var(--color-main)] border-[var(--color-main)] cursor-default":
                      fileName === "textures",
                  }
                )}
                onClick={() => setFileName("textures")}
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
              <Tooltip>
                <TooltipTrigger
                  className="w-8 h-8 rounded-none hover:bg-[var(--color-main)] border border-[var(--color-border)] border-t-0"
                  onClick={format}
                >
                  <ChartNoAxesGantt
                    className="stroke-primary-foreground m-auto"
                    size={19}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-primary-foreground"
                >
                  Format code (Ctrl+Shift+F or Cmd+Shift+F)
                </TooltipContent>
              </Tooltip>

              <Popover>
                <PopoverTrigger>
                  <Tooltip>
                    <TooltipTrigger className="w-8 h-8 rounded-none hover:bg-[var(--color-main)] border border-[var(--color-border)] border-t-0 border-l-0">
                      <IndentIncrease className="stroke-primary-foreground" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-primary-foreground"
                    >
                      Tab size
                    </TooltipContent>
                  </Tooltip>
                </PopoverTrigger>
                <PopoverContent
                  className="p-1 w-fit rounded-none bg-[var(--color-secondary)] border-[var(--color-border)]"
                  style={
                    {
                      "--color-main": main,
                      "--color-secondary": secondary,
                      "--color-border": border,
                    } as React.CSSProperties
                  }
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
                      className="text-primary-foreground data-[state=on]:bg-[var(--color-main)] data-[state=on]:text-primary-foreground rounded-none p-0 h-7 w-7 min-w-7 text-xs"
                      value="2"
                    >
                      2
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="text-primary-foreground data-[state=on]:bg-[var(--color-main)] data-[state=on]:text-primary-foreground rounded-none p-0 h-7 w-7 min-w-7 text-xs"
                      value="4"
                    >
                      4
                    </ToggleGroupItem>
                  </ToggleGroup>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-8 h-8 rounded-none hover:bg-[var(--color-main)] border border-[var(--color-border)] border-t-0 border-l-0"
                      >
                        <ALargeSmall className="stroke-primary-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-primary-foreground"
                    >
                      Text size
                    </TooltipContent>
                  </Tooltip>
                </PopoverTrigger>
                <PopoverContent
                  className="p-1 w-fit rounded-none bg-[var(--color-secondary)] border-[var(--color-border)]"
                  style={
                    {
                      "--color-main": main,
                      "--color-secondary": secondary,
                      "--color-border": border,
                    } as React.CSSProperties
                  }
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
                      className="text-primary-foreground data-[state=on]:bg-[var(--color-main)] data-[state=on]:text-primary-foreground rounded-none p-0 h-7 w-7 min-w-7 text-xs"
                      value="10"
                    >
                      10
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="text-primary-foreground data-[state=on]:bg-[var(--color-main)] data-[state=on]:text-primary-foreground rounded-none p-0 h-7 w-7 min-w-7 text-xs"
                      value="12"
                    >
                      12
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="text-primary-foreground data-[state=on]:bg-[var(--color-main)] data-[state=on]:text-primary-foreground rounded-none p-0 h-7 w-7 min-w-7 text-xs"
                      value="14"
                    >
                      14
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="text-primary-foreground data-[state=on]:bg-[var(--color-main)] data-[state=on]:text-primary-foreground rounded-none p-0 h-7 w-7 min-w-7 text-xs"
                      value="16"
                    >
                      16
                    </ToggleGroupItem>
                  </ToggleGroup>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-8 h-8 rounded-none hover:bg-[var(--color-main)] border border-[var(--color-border)] border-t-0 border-l-0"
                      >
                        <Palette className="stroke-primary-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-primary-foreground"
                    >
                      Theme
                    </TooltipContent>
                  </Tooltip>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 w-fit rounded-none bg-[var(--color-secondary)] border-[var(--color-border)]"
                  style={
                    {
                      "--color-main": main,
                      "--color-secondary": secondary,
                      "--color-border": border,
                    } as React.CSSProperties
                  }
                >
                  <Select
                    value={theme}
                    onValueChange={(value) => setTheme(value as typeof theme)}
                  >
                    <SelectTrigger className="w-40 h-8 rounded-none bg-transparent text-primary-foreground border-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      className="rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-primary-foreground"
                      style={
                        {
                          "--color-main": main,
                          "--color-secondary": secondary,
                          "--color-border": border,
                        } as React.CSSProperties
                      }
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
                <DialogTrigger>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-8 h-8 rounded-none hover:bg-[var(--color-main)] border-b border-[var(--color-border)]"
                      >
                        <Code className="stroke-primary-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="text-xs rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-primary-foreground"
                    >
                      Code snippets
                    </TooltipContent>
                  </Tooltip>
                </DialogTrigger>
                <DialogContent
                  className="w-fit !rounded-none bg-[var(--color-secondary)] border-[var(--color-border)] text-primary-foreground"
                  closeClassName="text-primary-foreground hover:bg-[var(--color-main)] rounded-none border-0 focus:ring-0 focus:ring-offset-0"
                  style={
                    {
                      ...props.style,
                      "--color-main": main,
                      "--color-secondary": secondary,
                      "--color-border": border,
                    } as React.CSSProperties
                  }
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
                              "stroke-primary-foreground cursor-pointer w-4 h-4",
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
            {fileName === "textures" ? (
              <Textures className="absolute inset-0 bg-[var(--color-main)]" />
            ) : (
              <GLSLEditor
                value={value}
                onChange={(value) => updateValue(value ?? "")}
                theme={theme}
                tabSize={tabSize}
                fontSize={fontSize}
              />
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-[var(--color-border)]" />
        <ResizablePanel className="relative">
          <Stats className="absolute top-0 right-0" />
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
