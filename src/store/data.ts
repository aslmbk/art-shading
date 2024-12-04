import { create } from "zustand";
import vertexShader from "@/shaders/sample/vertex.glsl";
import fragmentShader from "@/shaders/sample/fragment.glsl";

interface State {
  current: {
    vertexShader: string;
    fragmentShader: string;
  };
  updateVertexShader: (shader: string) => void;
  updateFragmentShader: (shader: string) => void;
}

export const useData = create<State>((set) => ({
  current: {
    vertexShader,
    fragmentShader,
  },
  updateVertexShader: (shader) =>
    set((state) => ({
      current: { ...state.current, vertexShader: shader },
    })),
  updateFragmentShader: (shader) =>
    set((state) => ({
      current: { ...state.current, fragmentShader: shader },
    })),
}));
