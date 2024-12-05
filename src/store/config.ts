import { themes, themesSettings } from "@/lib/constants";
import { create } from "zustand";
import { getBrightness, lightenColor } from "@/lib/utils";
import { persist } from "zustand/middleware";

type TabSize = 2 | 4;
type FontSize = 10 | 12 | 14 | 16;

interface State {
  theme: keyof typeof themes;
  colors: {
    main: string;
    secondary: string;
    border: string;
    text: string;
  };
  tabSize: TabSize;
  fontSize: FontSize;
  setTheme: (theme: keyof typeof themes) => void;
  setTabSize: (tabSize: TabSize) => void;
  setFontSize: (fontSize: FontSize) => void;
}

const getColors = (color: string) => {
  const brightness = getBrightness(color);
  return {
    main: color,
    secondary: lightenColor(color, -32),
    border: lightenColor(color, 32),
    text: brightness > 0.5 ? "#000000" : "#ffffff",
  };
};

export const useConfig = create<State>()(
  persist(
    (set, get) => ({
      theme: "material",
      colors: getColors(themesSettings.material?.background ?? "#1e1e1e"),
      tabSize: 2,
      fontSize: 12,
      setTheme: (theme) =>
        set({
          theme,
          colors: getColors(
            themesSettings[theme]?.background ?? get().colors.main
          ),
        }),
      setTabSize: (tabSize) => set({ tabSize }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: "config",
    }
  )
);
