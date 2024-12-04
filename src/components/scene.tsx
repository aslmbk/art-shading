import { useRef, useEffect } from "react";
import { Plane } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useData } from "@/store/data";

interface Props {
  vertexShader: string;
  fragmentShader: string;
}

export const Scene: React.FC<Props> = ({ vertexShader, fragmentShader }) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const setMainTexture = useData((state) => state.setMainTexture);
  const { viewport, gl, scene, camera } = useThree();

  useEffect(() => {
    const array = new Uint8Array(viewport.width * viewport.height * 4);
    const renderTarget = new THREE.WebGLRenderTarget(
      viewport.width,
      viewport.height
    );
    const texture = new THREE.DataTexture(
      array,
      viewport.width,
      viewport.height,
      THREE.RGBAFormat,
      THREE.UnsignedByteType
    );
    const cb = () => {
      gl.setRenderTarget(renderTarget);
      gl.render(scene, camera);
      gl.readRenderTargetPixels(
        renderTarget,
        0,
        0,
        viewport.width,
        viewport.height,
        array
      );
      texture.image.data.set(array);
      texture.needsUpdate = true;
      setMainTexture(texture);
      gl.setRenderTarget(null);
    };
    const interval = setInterval(cb, 100);
    return () => clearInterval(interval);
  }, [gl, viewport, setMainTexture, scene, camera]);

  useFrame(({ clock, viewport, gl, pointer }) => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderMaterialRef.current.uniforms.uResolution.value = new THREE.Vector2(
        viewport.width * gl.getPixelRatio(),
        viewport.height * gl.getPixelRatio()
      );
      shaderMaterialRef.current.uniforms.uMouse.value = new THREE.Vector2(
        pointer.x,
        pointer.y
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
          uMouse: new THREE.Uniform(new THREE.Vector2()),
          uTexture1: new THREE.Uniform(null),
          uTexture2: new THREE.Uniform(null),
          uTexture3: new THREE.Uniform(null),
          uTexture4: new THREE.Uniform(null),
        }}
      />
    </Plane>
  );
};
