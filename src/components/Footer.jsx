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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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

      // --- Lighting Setup (Matched exactly to Blender composition) ---
      const sunLight = new THREE.DirectionalLight(0xfffaed, 2.5);
      sunLight.position.set(1.6853, -4.2918, 2.2761);
      sunLight.castShadow = true;
      scene.add(sunLight);

      const spotLight = new THREE.SpotLight(0xfffaed, 200);
      spotLight.position.set(-12.85, -29.472, 21.805);
      spotLight.rotation.set(
        THREE.MathUtils.degToRad(38.564),
        THREE.MathUtils.degToRad(9.4694),
        THREE.MathUtils.degToRad(3.5783)
      );
      spotLight.angle = THREE.MathUtils.degToRad(46.1) / 2;
      spotLight.penumbra = 0.5;
      spotLight.castShadow = true;
      scene.add(spotLight);

      // --- Loaders ---
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
      );

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      let camera;
      let controls;
      let frameId;

      // --- Load Unified Final GLB Model with Exported Camera ---
      loader.load("/models/final.glb", (gltf) => {
        scene.add(gltf.scene);

        // Use the camera exported from Blender if available, otherwise fallback
        if (gltf.cameras && gltf.cameras.length > 0) {
          camera = gltf.cameras[0];
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
        } else {
          camera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
          );
          camera.position.set(3.2435, 1.9902, 3.8892);
          camera.lookAt(0, 0, 0);
        }

        // --- Controls (Touch/mouse interaction fully locked to preserve Numpad 0 view) ---
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 0, 0);
        controls.enableRotate = false;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableKeys = false;

        // --- Animation Loop ---
        const animate = () => {
          frameId = requestAnimationFrame(animate);
          controls.update();
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