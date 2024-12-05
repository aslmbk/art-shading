import { create } from "zustand";
import vertexShader from "@/shaders/sample/vertex.glsl";
import fragmentShader from "@/shaders/sample/fragment.glsl";
import * as THREE from "three";

export type FileType = {
  file: File | null;
  url: string;
};

const defaultFileType: FileType = {
  file: null,
  url: "",
};

interface State {
  current: {
    vertexShader: string;
    fragmentShader: string;
  };
  image1: FileType;
  image2: FileType;
  image3: FileType;
  image4: FileType;
  mainTexture: THREE.DataTexture | null;
  updateVertexShader: (shader: string) => void;
  updateFragmentShader: (shader: string) => void;
  setMainTexture: (texture: THREE.DataTexture) => void;
  setImage: (file: File | null, index: number) => void;
}

export const useData = create<State>((set) => ({
  current: {
    vertexShader,
    fragmentShader,
  },
  image1: defaultFileType,
  image2: defaultFileType,
  image3: defaultFileType,
  image4: defaultFileType,
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
  setImage: (file, index) =>
    set((state) => {
      const image = state[`image${index}` as keyof State] as FileType;
      URL.revokeObjectURL(image.url);
      const url = file ? URL.createObjectURL(file) : "";
      return { [`image${index}`]: { file, url } };
    }),
}));
