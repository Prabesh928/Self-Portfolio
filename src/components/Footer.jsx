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
      renderer.outputColorSpace = THREE.SRGBColorSpace; 
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.0005;
           
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.useLegacyLights = false; 
        renderer.physicallyCorrectLights = true;

      container.appendChild(renderer.domElement);

    
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

      loader.load("/models/afterrain.glb", (gltf) => {
       
        if (cancelled) return;

        scene.add(gltf.scene);
        scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 0.3)); 

        const mars = gltf.scene.getObjectByName("Mars");

        
       gltf.scene.traverse((child) => {
  if (child.isMesh) {
    // child.castShadow = true;
    // child.receiveShadow = true;

    // ADD THIS BLOCK
    if (child.material) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((mat) => {
        if (mat.map) {
          mat.map.colorSpace = THREE.SRGBColorSpace;
          mat.map.needsUpdate = true;
        }
      });
    }
  }
  if (child.isLight) {
    child.castShadow = true;
    console.log(
      "Light loaded:",
      child.type,
      "raw intensity:",
      child.intensity
    );

    if (child.type === "DirectionalLight") {
      // child.intensity = 1;
    } else {
      // child.intensity *= 1;
    }
  }
});

      

       
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

        // --- Animation Loop ---
        const animate = () => {
          frameId = requestAnimationFrame(animate);
          if (mars) {
              mars.rotation.z = THREE.MathUtils.degToRad(10);

            mars.rotation.y += 0.0007;
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
   <div className="relative w-full h-screen overflow-hidden ">
      {/* 3D Scene locked to the background */}
      <Scene className="absolute inset-0 w-full h-full z-12 pointer-events-none " />

      {/* Content wrapper using absolute positioning with precise placement */}
      <div className="absolute top-[48%] left-10 z-10 w-full h-full p-6 px-50  backdrop-blur-md rounded-lg text-[#DCCCBC]">
       <div className="h-full w-full flex flex-col">
        <div className="h-[18%]  text-2xl w-full font-semibold">
          <p>Currently exploring new opportunities   <br/>to grow in full-stack engineering.</p>
        </div>
        <div className="bg-[#DCCCBC] h-[0.3%] w-full"></div>
        <div className="h-[60%] mt-15  flex justify-around items-center gap-13">
          <div className="first w-[15%] h-full ">
            <div className="flex h-full w-full flex-col gap-2">
              <p>Work</p>
              <p>About</p>
              <p>prabeshgyawali@gmail.com</p>
              <p>Linkend</p>
            </div>
          </div>
          <div className="second w-[15%] h-full ">
             <div className="flex h-full w-full flex-col gap-2">
              <p>Onion</p>
              <p>Github</p>
              <p>Instagrm</p>
              <p>News</p>
            </div>
          </div>
          <div className="third w-[15%] h-full ">
             <div className="flex h-full w-full flex-col gap-2">
              <p>Projects</p>
              <p>About</p>
              <p>Blog</p>
              <p>Linkend</p>
            </div>
          </div>
          <div className="fourth ml-auto w-[15%] h-[70%]  flex flex-col">
            <p className=" underline">About Me</p>
          </div>
         

           </div> 
       </div>

      </div>
    </div>
  );
};

export default Footer;