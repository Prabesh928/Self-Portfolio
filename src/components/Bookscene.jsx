import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import page1 from "../assets/bookpage1.png";
import page2 from "../assets/bookpage2.png";
import page3 from '../assets/bookpage3.jpg'

gsap.registerPlugin(ScrollTrigger);

export const Bookscene = () => {
  const blueRef = useRef(null);
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    const container = canvasContainerRef.current;

    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    camera.position.set(1.208, -135.43, 32.593);

    camera.rotation.set(
      THREE.MathUtils.degToRad(89.813),
      THREE.MathUtils.degToRad(-0.9619),
      THREE.MathUtils.degToRad(-4.7326)
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    // Turn on shadows so the book can cast one, like the reference image
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(
      0xfff3e0, // warm white instead of pure white, for the cozy vibe
         2
    );

    light.position.set(-3, -20.43, 32.593);

    // Let this light cast a shadow, and set up its shadow camera frustum
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 300;
    light.shadow.camera.left = -60;
    light.shadow.camera.right = 60;
    light.shadow.camera.top = 60;
    light.shadow.camera.bottom = -60;
    light.shadow.bias = -0.0015;

    scene.add(light);

    
    const directionalLightHelper = new THREE.DirectionalLightHelper(light, 8, 0xff0000);
    scene.add(directionalLightHelper);

    const ambient = new THREE.AmbientLight(
      0xffe3c2, 
      0.5      
    );

    scene.add(ambient);

    let mixer = null;
    let actions = [];
    let totalDuration = 1;
    let bookWrapper = null;
    let shadowPlane = null;

    const loader = new GLTFLoader();

    loader.load(
      "/models/book.glb",
      (gltf) => {
        const bookObject = gltf.scene;
        

        bookObject.traverse((child) => {
  if (child.isMesh) {
    console.log("MESH:", child.name);
    child.castShadow = true;
    child.receiveShadow = true;
  }
});

        const textureLoader = new THREE.TextureLoader();

        const textures = [
          textureLoader.load(page1),
          textureLoader.load(page2),
          textureLoader.load(page3),
        ];

        

        textures.forEach((texture) => {
          texture.flipY = false;
          texture.colorSpace = THREE.SRGBColorSpace;
        });

        bookObject.traverse((child) => {
          if (
            child.isMesh &&
            child.name === "Page-1"
          ) {
            child.material.map = textures[0];
            child.material.needsUpdate = true;
          }

          if (
            child.isMesh &&
            child.name === "Page-2"
          ) {
            child.material.map = textures[1];
            child.material.needsUpdate = true;
          }

        if (child.isMesh && child.name === "Page-3") {
  console.log("PAGE 3 FOUND:", child);
  console.log("MATERIAL:", child.material);
  console.log("UV:", child.geometry.attributes.uv);

  child.material.map = textures[2];
  child.material.needsUpdate = true;
}

        });

        bookWrapper = new THREE.Group();

        bookWrapper.add(bookObject);

        light.target = bookWrapper;

        bookWrapper.position.set(
          -10.39925,
          0.018592,
          30.778
        );

        bookWrapper.rotation.set(
          THREE.MathUtils.degToRad(360),
          THREE.MathUtils.degToRad(184), 
          THREE.MathUtils.degToRad(180)
        );

       

        bookWrapper.scale.set(
          2.7,
          2.5,
          2.5
        );

        scene.add(bookWrapper);

       
        const shadowPlaneGeo = new THREE.PlaneGeometry(400, 400);
        const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.35 });
        shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
        shadowPlane.rotation.x = Math.PI / 2;
        shadowPlane.position.set(-10.39925, 15, 30.778);
        shadowPlane.receiveShadow = true;
        scene.add(shadowPlane);

        

        mixer = new THREE.AnimationMixer(
          bookObject
        );

        actions = gltf.animations.map((clip) => {
          const action = mixer.clipAction(clip);

          action.play();
          action.paused = true;
          action.clampWhenFinished = true;

          return action;
        });

        if (gltf.animations.length > 0) {
          totalDuration = Math.max(
            ...gltf.animations.map(
              (clip) => clip.duration
            )
          );
        }

        mixer.setTime(0);
      },
      undefined,
      (err) => {
        console.error(err);
      }
    );

    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    const handleResize = () => {
      camera.aspect =
        container.clientWidth /
        container.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    const st = ScrollTrigger.create({
      trigger: blueRef.current,

      start: "top top",

      end: "+=600%",

      pin: true,

      scrub: true,

      markers: false,

onUpdate: (self) => {
  const progress = self.progress;

  if (!mixer || actions.length === 0 || !bookWrapper) return;

  // Page animation
  const t = progress * totalDuration;

  actions.forEach((action) => {
    action.time = t;
  });

  mixer.update(0);

  // Book rotation
  if (progress <= 0.32) {
    bookWrapper.rotation.y = THREE.MathUtils.lerp(
      THREE.MathUtils.degToRad(184),
      THREE.MathUtils.degToRad(175),
      progress / 0.32
    );
  } else if (progress <= 0.64) {
    const secondPageProgress = gsap.utils.mapRange(
      0.32,
      0.64,
      0,
      1,
      progress
    );

    bookWrapper.rotation.y = THREE.MathUtils.lerp(
      THREE.MathUtils.degToRad(175),
      THREE.MathUtils.degToRad(184),
      secondPageProgress
    );
  } else if (progress <= 0.9) {
  bookWrapper.rotation.y = THREE.MathUtils.degToRad(184);
  bookWrapper.rotation.z = THREE.MathUtils.degToRad(180);
} else {
  const finalRotationProgress = gsap.utils.mapRange(
    0.9,
    1,
    0,
    1,
    progress
  );

  bookWrapper.rotation.y = THREE.MathUtils.degToRad(185);

  bookWrapper.rotation.z = THREE.MathUtils.lerp(
    THREE.MathUtils.degToRad(180),
    THREE.MathUtils.degToRad(360),
    finalRotationProgress
  );
}

  // // Camera movement
  // const introProgress = Math.min(progress, 0.32) / 0.32;

  // camera.position.x = THREE.MathUtils.lerp(
  //   1.208,
  //   -5,
  //   introProgress
  // );

  // camera.position.y = THREE.MathUtils.lerp(
  //   -135.43,
  //   -110,
  //   introProgress
  // );

  // camera.position.z = THREE.MathUtils.lerp(
  //   32.593,
  //   40,
  //   introProgress
  // );

  // camera.rotation.x = THREE.MathUtils.lerp(
  //   THREE.MathUtils.degToRad(89.813),
  //   THREE.MathUtils.degToRad(85),
  //   introProgress
  // );

  // camera.rotation.y = THREE.MathUtils.lerp(
  //   THREE.MathUtils.degToRad(-0.9619),
  //   THREE.MathUtils.degToRad(-3),
  //   introProgress
  // );

  // camera.rotation.z = THREE.MathUtils.lerp(
  //   THREE.MathUtils.degToRad(-4.7326),
  //   THREE.MathUtils.degToRad(-7),
  //   introProgress
  // );
},

    });

    return () => {
      st.kill();

      window.removeEventListener(
        "resize",
        handleResize
      );

      cancelAnimationFrame(frameId);

      renderer.dispose();

      if (
        container.contains(
          renderer.domElement
        )
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
  <div
    ref={blueRef}
    className="flex h-screen w-full bg-[#bb9429]"
  >

{/* auto changer component later*/}

    
   <div className="first flex h-full w-[10%] flex-col items-center justify-between py-12 text-[#2A2A2A] select-none">
  {/* Top Section / Spacing */}
  <div className="w-full bg-yellow-300" />

  {/* Middle Indicator Section */}
  <div className="flex flex-col items-center gap-4">
    {/* Top Vertical Divider Line */}
    <div className="h-16 w-[1px] bg-neutral-400" />

    {/* Project Number List */}
    <div className="flex flex-col items-center gap-3 font-mono text-sm tracking-widest">
      <span className="font-bold text-black text-base scale-110">01</span>
      <span className="text-neutral-400 hover:text-black cursor-pointer transition-colors">02</span>
      <span className="text-neutral-400 hover:text-black cursor-pointer transition-colors">03</span>
      <span className="text-neutral-400 hover:text-black cursor-pointer transition-colors">04</span>
      <span className="text-neutral-400 hover:text-black cursor-pointer transition-colors">05</span>
      <span className="text-neutral-400 hover:text-black cursor-pointer transition-colors">06</span>
    </div>

    {/* Bottom Vertical Divider Line */}
    <div className="h-16 w-[1px] bg-neutral-400" />
  </div>

  {/* Bottom Tagline */}
  <div className="text-center font-sans text-[10px] tracking-[0.25em] text-neutral-500 uppercase leading-relaxed">
    IDEAS<br />
    INTO<br />
    REALITY
  </div>
</div>

    <div
      ref={canvasContainerRef}
      className="h-full w-[65%] bg-pink-100"
    />

    <div className="third flex h-full w-[35%] flex-col justify-between py-16 pr-12 pl-6 text-[#1A1A1A] select-none">
  {/* Top Section Header */}
  <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.2em] text-neutral-500 uppercase">
    <span>Selected Work</span>
    <div className="h-[1px] flex-1 bg-neutral-300 mx-4" />
    <span className="font-mono text-black">01 / 06</span>
  </div>

  {/* Main Content Area */}
  <div className="flex flex-col gap-6 my-auto">
    {/* Title & Subtitle */}
    <div>
      <h2 className="text-4xl font-extrabold tracking-tight uppercase leading-[1.05] text-[#0F172A]">
        Solar Wind<br />Prediction
      </h2>
      <p className="mt-2 text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase">
        AI / Machine Learning
      </p>
    </div>

    {/* Project Description */}
    <p className="text-sm leading-relaxed text-neutral-600 font-normal max-w-md">
      A machine learning project to forecast solar wind parameters using time-series data. Built for the Benchlab competition with a focus on reproducibility and real-world deployment.
    </p>

    {/* Action Buttons */}
    <div className="flex items-center gap-4 pt-2">
      <a
        href="#"
        className="flex items-center gap-2 rounded-full bg-[#0F172A] px-6 py-3 text-xs font-medium text-white transition-transform hover:scale-105 active:scale-95"
      >
        <span>View Project</span>
        <span>&rarr;</span>
      </a>

      <a
        href="#"
        className="flex items-center gap-2 rounded-full px-4 py-3 text-xs font-semibold text-neutral-700 hover:text-black transition-colors"
      >
        <span>Live Demo</span>
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>

    {/* Tech Stack Pills */}
    <div className="flex flex-wrap gap-2 pt-2">
      {["Python", "Machine Learning", "Time Series", "Docker"].map((tech) => (
        <span
          key={tech}
          className="rounded-full border border-neutral-300 bg-white/50 px-3.5 py-1.5 text-[11px] font-medium text-neutral-700 backdrop-blur-sm"
        >
          {tech}
        </span>
      ))}
    </div>
  </div>

  {/* Bottom Scroll Indicator */}
  <div className="flex items-center gap-3 pt-4 text-neutral-400">
    <svg className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
    <span className="text-[10px] font-medium tracking-[0.2em] uppercase">Scroll to explore</span>
  </div>
</div>
  </div>
);
};