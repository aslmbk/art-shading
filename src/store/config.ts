import { themes } from "@/lib/constants";
import { create } from "zustand";

type TabSize = 2 | 4;
type FontSize = 10 | 12 | 14 | 16;

interface State {
  theme: keyof typeof themes;
  tabSize: TabSize;
  fontSize: FontSize;
  setTheme: (theme: keyof typeof themes) => void;
  setTabSize: (tabSize: TabSize) => void;
  setFontSize: (fontSize: FontSize) => void;
}

export const useConfig = create<State>((set) => ({
  theme: "material",
  tabSize: 2,
  fontSize: 12,
  setTheme: (theme) => set({ theme }),
  setTabSize: (tabSize) => set({ tabSize }),
  setFontSize: (fontSize) => set({ fontSize }),
}));
