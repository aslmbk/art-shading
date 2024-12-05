import { useEffect } from "react";
import { Plane } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useData } from "@/store/data";

const textureLoader = new THREE.TextureLoader();

const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: new THREE.Uniform(0),
    uResolution: new THREE.Uniform(new THREE.Vector2()),
    uMouse: new THREE.Uniform(new THREE.Vector2()),
    uTexture1: new THREE.Uniform(null),
    uTexture2: new THREE.Uniform(null),
    uTexture3: new THREE.Uniform(null),
    uTexture4: new THREE.Uniform(null),
  },
});

interface Props {
  vertexShader: string;
  fragmentShader: string;
}

export const Scene: React.FC<Props> = ({ vertexShader, fragmentShader }) => {
  const setMainTexture = useData((state) => state.setMainTexture);
  const image1 = useData((state) => state.image1);
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
    return () => {
      clearInterval(interval);
      renderTarget.dispose();
      texture.dispose();
    };
  }, [gl, viewport, setMainTexture, scene, camera]);

  useEffect(() => {
    if (image1.url) {
      textureLoader.load(image1.url, (texture) => {
        const uniform = shaderMaterial.uniforms.uTexture1;
        if (uniform.value) uniform.value.dispose();
        uniform.value = texture;
        shaderMaterial.needsUpdate = true;
      });
    }
  }, [image1.url]);

  useFrame(({ clock, viewport, gl, pointer }) => {
    shaderMaterial.uniforms.uTime.value = clock.getElapsedTime();
    shaderMaterial.uniforms.uResolution.value = new THREE.Vector2(
      viewport.width * gl.getPixelRatio(),
      viewport.height * gl.getPixelRatio()
    );
    shaderMaterial.uniforms.uMouse.value = new THREE.Vector2(
      pointer.x,
      pointer.y
    );
  });

  useEffect(() => {
    shaderMaterial.vertexShader = vertexShader;
    shaderMaterial.fragmentShader = fragmentShader;
    shaderMaterial.needsUpdate = true;
  }, [vertexShader, fragmentShader]);

  return <Plane position={[0.5, 0.5, 0]} material={shaderMaterial} />;
};
