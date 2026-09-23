import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import page1 from "../assets/bookpage1.png";
import page2 from "../assets/bookpage2.png";
import page3 from '../assets/bookpage3.jpg'
import Dynamicnumbers from "./Dynamicnumbers";
import Projectdetails from "./Projectdetails";
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
    className="flex h-screen w-full bg-[#F5F2EA]"
  >

{/* auto changer component later*/}

    
 

<Dynamicnumbers />

    <div
      ref={canvasContainerRef}
      className="h-full w-[65%] bg-pink-100"
    />



<Projectdetails />
  </div>
);
};