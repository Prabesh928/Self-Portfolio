import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);

export const Bookscene = () => {
  const blueRef = useRef(null);
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    const container = canvasContainerRef.current;

    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

 
camera.position.set(
  1.208,
  -135.43,
  32.593
);

camera.rotation.set(
  THREE.MathUtils.degToRad(89.813),
  THREE.MathUtils.degToRad(-0.9619),
  THREE.MathUtils.degToRad(-4.7326)
);

    // RENDERER
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

    container.appendChild(renderer.domElement);

    // LIGHTS
    const light = new THREE.DirectionalLight(
      0xffffff,
      3
    );

    light.position.set(10, 10, 10);

    scene.add(light);

    const ambient = new THREE.AmbientLight(
      0xffffff,
      1
    );

    scene.add(ambient);

    // BOOK
    let mixer = null;
    let actions = [];
    let totalDuration = 1;

    const loader = new GLTFLoader();

    loader.load(
      "/models/book.glb",

      (gltf) => {
        const bookObject = gltf.scene;

     
const bookWrapper = new THREE.Group();


bookWrapper.add(bookObject);



bookWrapper.position.set(
  0.39925,
  0.018592,
  30.778
);



bookWrapper.rotation.set(
  THREE.MathUtils.degToRad(0),
   THREE.MathUtils.degToRad(180),
  THREE.MathUtils.degToRad(180)
);

bookWrapper.scale.set(
  2.6,
  2,
  2.002
);

// Add wrapper to scene
scene.add(bookWrapper);

        

        
       

        // Animation
        mixer = new THREE.AnimationMixer(bookObject);

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

        // actions.forEach((action) => {
        //   action.time = 0;
        // });

     mixer.setTime(totalDuration);
      },

      undefined,

      (err) => {
        console.error(err);
      }
    );

    // RENDER
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE
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

    // SCROLL
    const st = ScrollTrigger.create({
      trigger: blueRef.current,
      start: "top top",
      end: "+=400%",
      pin: true,
      scrub: true,

      onUpdate: (self) => {
        if (!mixer || actions.length === 0) return;

        const t =
          self.progress * totalDuration;

        actions.forEach((action) => {
          action.time = t;
        });

        mixer.update(0);
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
        container.contains(renderer.domElement)
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
      className="h-[100vh] w-full bg-black"
    >
      <div
        ref={canvasContainerRef}
        className="w-full h-full"
      />
    </div>
  );
};