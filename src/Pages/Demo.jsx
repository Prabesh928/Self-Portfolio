import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);

const Demo = () => {
  const blueRef = useRef(null);
  const canvasContainerRef = useRef(null);

useEffect(() => {

  //basic setup here scene , camera 
  const container = canvasContainerRef.current;
if (!container) return;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);
camera.position.set(0, 1.2, 2.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);


//lights
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(2, 3, 2);
scene.add(light);


//book import here 
const loader = new GLTFLoader();
loader.load(
  "/models/book.glb",
  (gltf) => {
    const bookObject = gltf.scene;
    scene.add(bookObject);

    const mixer = new THREE.AnimationMixer(bookObject);
    const clip = gltf.animations.find((c) => c.name === "Action");

    if (clip) {
      const action = mixer.clipAction(clip);
      action.play();
      action.paused = true;
      action.time = clip.duration;      // force it to frame 0 = closed pose
      mixer.update(0);       // apply that pose immediately
    } else {
      console.error("Action clip not found. Available:", gltf.animations.map(c => c.name));
    }
  },
  undefined,
  (err) => console.error("Error loading book.glb:", err)
);


//render here 
let frameId;
const animate = () => {
  frameId = requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();


  const st = ScrollTrigger.create({
    trigger: blueRef.current,
    start: "top top",
    end: "+=400%",
    markers: true,
    pin: true,
    scrub: true,
  });

  return () => {
    st.kill(); 
  };
}, []);

  return (
    
      

      <div
        ref={blueRef}
        className="h-[100vh] w-full bg-blue-600 flex"
      >
        <div className="bookleft bg-green-900 w-1/2 flex items-center">
       <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, cumque dicta incidunt dolorum reprehenderit quas cupiditate fuga expedita, laudantium qui corporis voluptates quaerat iste. Eveniet ad illum cumque, magnam modi similique necessitatibus exercitationem. </p></div>
        <div ref={canvasContainerRef} className="bookright bg-yellow-500 w-1/2 ">right</div>
      </div>
    
  );
};

export default Demo;
