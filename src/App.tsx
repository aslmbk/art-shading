import { Canvas } from "@react-three/fiber";
import { IDE } from "./widgets/ide";
import vertexShader from "@/shaders/sample/vertex.glsl";
import fragmentShader from "@/shaders/sample/fragment.glsl";
import { Plane } from "@react-three/drei";

export const App: React.FC = () => {
  return (
    <div className="relative w-screen h-screen bg-no-repeat bg-cover bg-center">
      <Canvas
        className="absolute inset-0 z-0"
        orthographic
        camera={{ left: 0, right: 1, top: 1, bottom: 0, near: 0.1, far: 100 }}
      >
        <Plane position={[0.5, 0.5, 0]}>
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
          />
        </Plane>
      </Canvas>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-lg z-10" />
      <IDE className="absolute z-20 top-[5%] left-[5%] w-[90%] h-[90%]" />
    </div>
  );
};
