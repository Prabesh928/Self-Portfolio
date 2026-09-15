import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import page1 from "../assets/bookpage1.png";
import page2 from "../assets/bookpage2.png";

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

    container.appendChild(renderer.domElement);

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

    let mixer = null;
    let actions = [];
    let totalDuration = 1;
    let bookWrapper = null;

    const loader = new GLTFLoader();

    loader.load(
      "/models/book.glb",
      (gltf) => {
        const bookObject = gltf.scene;

        const textureLoader = new THREE.TextureLoader();

        const textures = [
          textureLoader.load(page1),
          textureLoader.load(page2),
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
        });

        bookWrapper = new THREE.Group();

        bookWrapper.add(bookObject);

        bookWrapper.position.set(
          0.39925,
          0.018592,
          30.778
        );

        bookWrapper.rotation.set(
          THREE.MathUtils.degToRad(360),
          THREE.MathUtils.degToRad(185),
          THREE.MathUtils.degToRad(180)
        );

        bookWrapper.scale.set(
          2.2,
          2,
          2
        );

        scene.add(bookWrapper);

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

      markers: true,

      onUpdate: (self) => {
        const progress = self.progress;

        // rotation 
        

        if (bookWrapper) {
          if (progress < 0.25) {
            const rotationProgress =
              progress / 0.25;

            bookWrapper.rotation.y =
              THREE.MathUtils.lerp(
                THREE.MathUtils.degToRad(185),
                THREE.MathUtils.degToRad(170),
                rotationProgress
              );
          } else {
            bookWrapper.rotation.y =
              THREE.MathUtils.degToRad(170);
          }
        }

        // Page turn 15 per onlyu 
        

        if (!mixer || actions.length === 0) {
          return;
        }

        if (progress >= 0.1) {
          const pageProgress =
            gsap.utils.mapRange(
              0.15,
              1,
              0,
              1,
              progress
            );

          const t =
            pageProgress *
            totalDuration;

          actions.forEach((action) => {
            action.time = t;
          });

          mixer.update(0);
        }
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
      className="h-[100vh] w-full bg-black"
    >
      <div
        ref={canvasContainerRef}
        className="h-full w-full"
      />
    </div>
  );
};