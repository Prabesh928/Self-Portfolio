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
  const laptopObjectRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Animation Refs
  const cameraTlRef = useRef(null); // Camera movement
  const laptopTlRef = useRef(null); // Laptop open
  const keyLightsTlRef = useRef(null); // Key lights
  const laptopbackRef = useRef(null); // Laptop back/rotation

  useEffect(() => {
    // 1. Create GSAP Context for React cleanup
    let ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      // --- Scene ---
      const scene = new THREE.Scene();

      // --- Camera ---
      const camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        100,
      );
      camera.position.set(0, 2, 5);

      // --- Renderer ---
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
      renderer.setSize(container.clientWidth, container.clientHeight);

      // Tone Mapping & Soft Shadows
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(renderer.domElement);

      // --- Controls ---
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = false;

      // 1. Ambient Light
      const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.6);  
      scene.add(ambientLight);

      

      // 2. Strong Right Light
      const rightLight = new THREE.DirectionalLight(0xffecd6, 5);   
      rightLight.position.set(4.5, 3.5, 2.5);
      rightLight.castShadow = false;                 

      rightLight.shadow.mapSize.width = 2048;   
      rightLight.shadow.mapSize.height = 2048;
      rightLight.shadow.bias = -0.04;
      rightLight.shadow.normalBias = 0.15;      

      rightLight.shadow.camera.near = 1;
      rightLight.shadow.camera.far = 10;
      rightLight.shadow.camera.left = -3;
      rightLight.shadow.camera.right = 3;
      rightLight.shadow.camera.top = 3;
      rightLight.shadow.camera.bottom = -3;
      rightLight.shadow.camera.updateProjectionMatrix();

      scene.add(rightLight);

      const rightLight2 = new THREE.DirectionalLight(0xffecd6, 5);   
      rightLight2.position.set(4.5, -1, 2.5);
       scene.add(rightLight2);

     

      // 3. Strong Top Light
      const topLight = new THREE.DirectionalLight(0xFFFBE5, 2.8);  
      topLight.position.set(0, 7, 1);
      scene.add(topLight);


      // Spotlight (Starts at intensity 0)
      const backLight = new THREE.SpotLight(0xffffff, 0); 
      backLight.position.set(0, -5, -1.7); 
      backLight.target.position.set(0, 3, -5); 
      backLight.angle = Math.PI / 2;
      backLight.penumbra = 0.8; 
      backLight.distance = 20;

      scene.add(backLight);
      scene.add(backLight.target);

      // 4. Floor Shadow Plane
      const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.ShadowMaterial({ opacity: 0.35 })
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -1.25;
      shadowPlane.receiveShadow = true;
      scene.add(shadowPlane);

      // --- Load Model ---
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
      );

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load("/models/laptop.glb", (gltf) => {
        const laptop = gltf.scene;
        laptopObjectRef.current = laptop;
        
        laptop.traverse((child) => {
          if (child.isMesh) {
            const isScreen = child.name.toLowerCase().includes("screen");
            child.castShadow = !isScreen;  
            child.receiveShadow = true;

            
          }
        });
        laptop.scale.set(5, 5, 5);
        scene.add(laptop);

        // Setup for wall behind 
        const wallGeometry = new THREE.PlaneGeometry(15, 10);
        const wallMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x0b0b0f, 
          roughness: 0,  
          metalness: 0
        });

        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(0, 0, -3); 
        scene.add(wall);

        const screen =
          laptop.getObjectByName("Screen") || laptop.getObjectByName("screen");

        // --- Initial State ---
        if (screen) {
          screen.position.set(0, -0.098, -0.14);
          screen.rotateX(1.95);
        }

        if (screen && screen.material) {
          screen.material.envMapIntensity = 0; 
          screen.material.roughness = 0.4;     
          screen.material.needsUpdate = true;
        }

        // --- Key lights setup ---
        const keys = ["keyp", "keyo", "keyr", "keyt", "keyf", "keyl", "keyi"];
        const keyLights = [];
        keys.forEach((name) => {
          const keyObj = laptop.getObjectByName(name);
          if (keyObj) {
            const light = new THREE.PointLight(0xf5f5f5, 1, 0.05);
            keyObj.getWorldPosition(light.position);
            scene.add(light);
            keyLights.push(light);
          }
        });

        // --- TIMELINE 1: Camera Movement (g1) ---
        const g1 = gsap.timeline({ paused: true });
        g1.to(camera.position, { x: -0.073, y: 0.551, z: 1.212, duration: 5 });

        // --- TIMELINE 2: Laptop Open (tl) ---
        const tl = gsap.timeline({ paused: true });
        const initialRotationX = camera.rotation.x;
        
        if (screen) {
          tl.to(
            screen.rotation,
            {
              keyframes: [
                { x: -2.95, duration: 1, ease: "none" },
                { x: -3.27, duration: 1, ease: "none" },
                { x: -3.5, duration: 1, ease: "none" },
                { x: -3.8, duration: 1, ease: "none" },
                { x: -4.2, duration: 1, ease: "none" },
                { x: -4.5, duration: 1, ease: "power1.out" },
              ],
            },
            0,
          )
          .to(
            screen.position,
            {
              keyframes: [
                { z: -0.13, y: -0.11, duration: 1, ease: "none" },
                { z: -0.09, y: -0.111, duration: 1, ease: "none" },
                { z: -0.072, y: -0.102, duration: 1, ease: "none" },
                { z: -0.045, y: -0.085, duration: 1, ease: "none" },
                { z: -0.012, y: -0.055, duration: 1, ease: "none" },
                { z: -0.004, y: -0.023, duration: 1, ease: "power1.out" },
              ],
            },
            0,
          )
          .to(
            camera.position,
            {
              keyframes: [
                { x: -0.063, y: 0.485, z: 0.463, duration: 3, ease: "power1.inOut" },
                { x: 0.003, y: 0.822, z: 0.542, duration: 3, ease: "power1.inOut" },
              ],
            },
            0,
          )
          .to(
            camera.rotation,
            {
              keyframes: [
                { x: THREE.MathUtils.degToRad(-60), duration: 3, ease: "power1.inOut" },
              ],
            },
            0,
          );
        }

        // --- TIMELINE 3: Key Lights ---
        const keysTl = gsap.timeline({ paused: true });
        keyLights.forEach((light, i) => {
          keysTl.fromTo(
            light,
            { intensity: 0 },
            { intensity: 2, duration: 0.5, ease: "power2.inOut" },
            i * 0.4,
          );
        });
        keysTl.to(keyLights, { intensity: 2, duration: 0.5, ease: "power2.out" });
        keysTl.to(keyLights, { intensity: 0, duration: 1.2, ease: "power2.out" });

        // --- TIMELINE 4: Laptop Back/Transform (T04) ---
        const T04 = gsap.timeline({ paused: true });

        T04.to(camera.position, { x: 0, y: 0.5, z: 3.2, duration: 4, ease: "power2.inOut" }, 0)
          .to(camera.rotation, { x: initialRotationX, y: 0, z: 0, duration: 4, ease: "power2.inOut" }, 0)
          .to(laptop.rotation, { x: 0, y: Math.PI * 2, z: 0, duration: 4, ease: "power2.inOut", overwrite: "auto"}, 0)
          .to(laptop.scale, { x: 6, y: 6, z: 6, duration: 4, ease: "power2.inOut" }, 0)
          .to(laptop.position, { x: 0, y: -2.2, z: -0.5, duration: 4, ease: "power2.inOut", overwrite: "auto" }, 0)
          .to(ambientLight, { intensity: 0, duration: 0.4 }, 3.0)
          .to(rightLight, { intensity: 0, duration: 0.4 }, "<")
          .to(topLight, { intensity: 0, duration: 0.4 }, "<")
          
          // ✨ ONLY turn off castShadow for the light (leaves renderer shadow map safe)
          .call(() => {
            rightLight.castShadow = false;
          }, [], "<")
          
          .to(backLight, { intensity: 900, duration: 0.6 }, "+=1");

        // --- SCROLL TRIGGER ---
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top-=150 top",
          end: "+=0", 
          once: true,  
          onEnter: () => {
            gsap.to(backLight, { intensity: 0, duration: 0.6 });

            // ✨ Turn shadow casting back on right when front lights return
            rightLight.castShadow = true;
            
            gsap.to(ambientLight, { intensity: 0.6, duration: 0.6 });
            gsap.to(rightLight, { intensity: 5, duration: 0.6 });
            gsap.to(topLight, { intensity: 2.8, duration: 0.6 });
          }
        });

        // Assign to Refs
        cameraTlRef.current = g1;
        laptopTlRef.current = tl;
        keyLightsTlRef.current = keysTl;
        laptopbackRef.current = T04;

        setIsReady(true);
      });

      // --- Loop ---
      let frameId;
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      // --- Resize ---
      const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", handleResize);

      // --- Return internal cleanup ---
      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(frameId);
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
    laptopBack: () => laptopbackRef.current,
    getLaptopObject: () => laptopObjectRef.current,
    isReady: () => isReady,
    cameraMove: () => cameraTlRef.current,
    laptopOpen: () => laptopTlRef.current,
    keyLightsOn: () => keyLightsTlRef.current,
    onReady: (cb) => {
      const check = setInterval(() => {
        if (
          cameraTlRef.current &&
          laptopTlRef.current &&
          keyLightsTlRef.current
        ) {
          clearInterval(check);
          cb();
        }
      }, 50);
    },
  }));

  return (
    <div
      ref={containerRef}
      className={props.className}
      style={{ width: "100%", height: "110vh" }}
    />
  );
});