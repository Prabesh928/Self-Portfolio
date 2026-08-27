import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);

const Demo = () => {
  const blueRef = useRef(null);
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    // --- basic setup: scene, camera, renderer ---
    const container = canvasContainerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

   const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);


camera.position.set(17.47, 52.804, 33.733);


camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- lights ---
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(2, 3, 2);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    // --- book import ---
    let mixer = null;
    let actions = [];
    let totalDuration = 1; // avoid divide-by-zero before load finishes

  
  const loader = new GLTFLoader();
    loader.load(
      "/models/book.glb",
      (gltf) => {
        const bookObject = gltf.scene;

        // --- CHANGE HERE: Normalize the model to (0,0,0) ---
        bookObject.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(bookObject);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        console.log("Book size:", size, "center:", center);

        // This shifts the model's center right to world origin (0,0,0)
        bookObject.position.sub(center);

        // Add the centered object to the scene
        scene.add(bookObject);
        // ---------------------------------------------------

        mixer = new THREE.AnimationMixer(bookObject);

        actions = gltf.animations.map((clip) => {
          const action = mixer.clipAction(clip);
          action.play();
          action.paused = true;
          action.clampWhenFinished = true;
          return action;
        });

        totalDuration = Math.max(...gltf.animations.map((c) => c.duration));

        actions.forEach((a) => (a.time = 0));
        mixer.update(0);
      },
      undefined,
      (err) => console.error("Error loading book.glb:", err)
    );

    // --- render loop ---
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // --- resize ---
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- scroll trigger: pin + scrub, drives all clips together ---
    const st = ScrollTrigger.create({
      trigger: blueRef.current,
      start: "top top",
      end: "+=400%",
      markers: true,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        if (!mixer || actions.length === 0) return;
        const t = self.progress * totalDuration;
        actions.forEach((a) => {
          a.time = t;
        });
        mixer.update(0); // 0 delta - we're setting time directly, not advancing playback
      },
    });

    // --- cleanup ---
    return () => {
      st.kill();
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={blueRef} className="h-[100vh] w-full bg-blue-600 flex">
      <div className="bookleft bg-green-900 w-1/2 flex items-center">
        <p className="p-12 text-white">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora,
          cumque dicta incidunt dolorum reprehenderit quas cupiditate fuga
          expedita, laudantium qui corporis voluptates quaerat iste. Eveniet
          ad illum cumque, magnam modi similique necessitatibus exercitationem.
        </p>
      </div>
      <div
        ref={canvasContainerRef}
        className="bookright bg-yellow-500 w-1/2 h-full"
      />
    </div>
  );
};

export default Demo;