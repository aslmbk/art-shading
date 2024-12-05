import { useEffect } from "react";
import { Plane } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { FileType, useData } from "@/store/data";

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

const updateTexture = (
  uniform: THREE.IUniform<THREE.Texture | null>,
  image: FileType
) => {
  if (image.url) {
    textureLoader.load(image.url, (texture) => {
      if (uniform.value) uniform.value.dispose();
      uniform.value = texture;
      shaderMaterial.needsUpdate = true;
    });
  } else {
    if (uniform.value) uniform.value.dispose();
    uniform.value = null;
    shaderMaterial.needsUpdate = true;
  }
};

export const Scene: React.FC = () => {
  const setMainTexture = useData((state) => state.setMainTexture);
  const image1 = useData((state) => state.image1);
  const image2 = useData((state) => state.image2);
  const image3 = useData((state) => state.image3);
  const image4 = useData((state) => state.image4);
  const vertexShader = useData((state) => state.current.vertexShader);
  const fragmentShader = useData((state) => state.current.fragmentShader);
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
    updateTexture(shaderMaterial.uniforms.uTexture1, image1);
  }, [image1]);

  useEffect(() => {
    updateTexture(shaderMaterial.uniforms.uTexture2, image2);
  }, [image2]);

  useEffect(() => {
    updateTexture(shaderMaterial.uniforms.uTexture3, image3);
  }, [image3]);

  useEffect(() => {
    updateTexture(shaderMaterial.uniforms.uTexture4, image4);
  }, [image4]);

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
