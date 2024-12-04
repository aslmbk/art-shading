import { create } from "zustand";
import vertexShader from "@/shaders/sample/vertex.glsl";
import fragmentShader from "@/shaders/sample/fragment.glsl";
import * as THREE from "three";

interface State {
  current: {
    vertexShader: string;
    fragmentShader: string;
  };
  mainTexture: THREE.DataTexture | null;
  updateVertexShader: (shader: string) => void;
  updateFragmentShader: (shader: string) => void;
  setMainTexture: (texture: THREE.DataTexture) => void;
}

export const useData = create<State>((set) => ({
  current: {
    vertexShader,
    fragmentShader,
  },
  mainTexture: null,
  updateVertexShader: (shader) =>
    set((state) => ({
      current: { ...state.current, vertexShader: shader },
    })),
  updateFragmentShader: (shader) =>
    set((state) => ({
      current: { ...state.current, fragmentShader: shader },
    })),
  setMainTexture: (texture) => set({ mainTexture: texture }),
}));
