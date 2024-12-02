import { useRef, useEffect } from "react";
import { Plane } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface Props {
  vertexShader: string;
  fragmentShader: string;
}

export const Scene: React.FC<Props> = ({ vertexShader, fragmentShader }) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock, viewport, gl }) => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderMaterialRef.current.uniforms.uResolution.value = new THREE.Vector2(
        viewport.width * gl.getPixelRatio(),
        viewport.height * gl.getPixelRatio()
      );
    }
  });

  useEffect(() => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.vertexShader = vertexShader;
      shaderMaterialRef.current.fragmentShader = fragmentShader;
      shaderMaterialRef.current.needsUpdate = true;
    }
  }, [vertexShader, fragmentShader]);

  return (
    <Plane position={[0.5, 0.5, 0]}>
      <shaderMaterial
        ref={shaderMaterialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: new THREE.Uniform(0),
          uResolution: new THREE.Uniform(new THREE.Vector2()),
        }}
      />
    </Plane>
  );
};
