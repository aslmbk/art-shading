import { create } from "zustand";
import vertexShader from "@/shaders/sample/vertex.glsl";
import fragmentShader from "@/shaders/sample/fragment.glsl";
import * as THREE from "three";
import { Tables } from "@/supabase.types";

export type FileType = {
  file: File | null;
  url: string;
};

const defaultFileType: FileType = {
  file: null,
  url: "",
};

const defaultShader: Tables<"shader"> = {
  id: Infinity,
  vertex: vertexShader,
  fragment: fragmentShader,
  category: null,
  type: null,
  texture1: null,
  texture2: null,
  texture3: null,
  texture4: null,
  version: null,
  created_at: "",
};

interface State {
  current: Tables<"shader">;
  shaders: Tables<"shader">[];
  categories: Tables<"category">[];
  types: Tables<"type">[];
  tags: Tables<"tags">[];
  image1: FileType;
  image2: FileType;
  image3: FileType;
  image4: FileType;
  mainTexture: THREE.DataTexture | null;
  updateVertexShader: (shader: string) => void;
  updateFragmentShader: (shader: string) => void;
  setMainTexture: (texture: THREE.DataTexture) => void;
  setImage: (file: File | null, index: number) => void;
  setCurrentShader: (shader: Tables<"shader">) => void;
  setShaders: (shaders: Tables<"shader">[]) => void;
  setCategories: (categories: Tables<"category">[]) => void;
  setTypes: (types: Tables<"type">[]) => void;
  setTags: (tags: Tables<"tags">[]) => void;
}

export const useData = create<State>((set) => ({
  current: defaultShader,
  shaders: [],
  categories: [],
  types: [],
  tags: [],
  image1: defaultFileType,
  image2: defaultFileType,
  image3: defaultFileType,
  image4: defaultFileType,
  mainTexture: null,
  updateVertexShader: (shader) =>
    set((state) => {
      if (!state.current) return state;
      return {
        current: { ...state.current, vertex: shader },
      };
    }),
  updateFragmentShader: (shader) =>
    set((state) => {
      if (!state.current) return state;
      return {
        current: { ...state.current, fragment: shader },
      };
    }),
  setMainTexture: (texture) => set({ mainTexture: texture }),
  setImage: (file, index) =>
    set((state) => {
      const image = state[`image${index}` as keyof State] as FileType;
      URL.revokeObjectURL(image.url);
      const url = file ? URL.createObjectURL(file) : "";
      return { [`image${index}`]: { file, url } };
    }),
  setCurrentShader: (shader) => set({ current: shader }),
  setShaders: (shaders) => set({ shaders }),
  setCategories: (categories) => set({ categories }),
  setTypes: (types) => set({ types }),
  setTags: (tags) => set({ tags }),
}));
