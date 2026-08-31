import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Scene = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      // --- Scene ---
      const scene = new THREE.Scene();

      // --- Renderer ---
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(renderer.domElement);

      // NOTE: No manual lights here anymore.
      // All lights (Sun/Spot/Point) were added in Blender and are baked
      // into final.glb. GLTFLoader auto-converts them into THREE.Light
      // objects and they come in automatically with gltf.scene below.

      // --- Loaders ---
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
      );

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      let camera;
      let frameId;
      let cancelled = false;

      // --- Load Unified Final GLB Model with Camera + Lights baked in ---
      loader.load("/models/final.glb", (gltf) => {
        // Guard against React StrictMode double-invoking this effect in
        // development, which would otherwise load the model twice and
        // stack duplicate lights/meshes into the scene (causing the
        // overexposed/white look even after intensity scaling).
        if (cancelled) return;

        scene.add(gltf.scene);

        const mars = gltf.scene.getObjectByName("Mars");

        // Optional: enable shadow casting/receiving on meshes,
        // since Blender export doesn't always set this per-object.
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
          if (child.isLight) {
            child.castShadow = true;
            console.log(
              "Light loaded:",
              child.type,
              "raw intensity:",
              child.intensity
            );
            // Blender's glTF export converts Sun Strength (W/m^2) into
            // lux using: lux = W/m^2 * 683. Three.js intensity isn't in
            // lux by default, so we divide back out to get a sane value
            // (e.g. 3415 / 683 = 5, matching the original Blender Sun
            // strength). Adjust the trailing multiplier to taste.
            if (child.type === "DirectionalLight") {
              child.intensity = (child.intensity / 683) * 1;

              // IMPORTANT: Three.js DirectionalLight ignores rotation for
              // lighting direction - it only uses position -> target.
              // Blender's Sun direction comes from rotation, so GLTFLoader
              // sets the correct quaternion on the object, but Three.js
              // never reads it for shading. We rebuild the target point
              // by projecting forward along the light's local -Z axis
              // (Three.js light convention) from its current position.
              const forward = new THREE.Vector3(0, 0, -1);
              forward.applyQuaternion(child.quaternion);
              const targetPos = child.position.clone().add(forward);

              child.target.position.copy(targetPos);
              scene.add(child.target);
              child.target.updateMatrixWorld();
            } else {
              child.intensity *= 0.01;
            }
          }
        });

        // Use the camera exported from Blender (Camera001).
        // gltf.cameras[0] will be whichever camera was set active
        // in Blender at export time (Ctrl+Numpad0 before exporting).
        if (gltf.cameras && gltf.cameras.length > 0) {
          camera = gltf.cameras[0];
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
        } else {
          // Fallback only runs if no camera was exported in the GLB.
          camera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
          );
          camera.position.set(3.2435, 1.9902, 3.8892);
          camera.lookAt(0, 0, 0);
        }

        // --- Animation Loop ---
        const animate = () => {
          frameId = requestAnimationFrame(animate);
          if (mars) {
            mars.rotation.y += 0.0005;
          }
          renderer.render(scene, camera);
        };
        animate();

        setIsReady(true);
      });

      // --- Resize Handler ---
      const handleResize = () => {
        if (!container || !camera) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        cancelled = true;
        window.removeEventListener("resize", handleResize);
        if (frameId) cancelAnimationFrame(frameId);
        renderer.dispose();
        dracoLoader.dispose();
        if (container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useImperativeHandle(ref, () => ({
    isReady: () => isReady,
  }));

  return (
    <div
      ref={containerRef}
      className={props.className}
      style={{ width: "100%", height: "100%" }}
    />
  );
});

const Footer = () => {
  return (
    <div className="w-full h-full">
      <Scene className="w-full h-full" />
    </div>
  );
};

export default Footer;