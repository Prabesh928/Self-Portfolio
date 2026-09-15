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
        

        bookObject.traverse((child) => {
  if (child.isMesh) {
    console.log("MESH:", child.name);
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

        bookWrapper.position.set(
          0.39925,
          0.018592,
          30.778
        );

        bookWrapper.rotation.set(
          THREE.MathUtils.degToRad(360),
          THREE.MathUtils.degToRad(170),
          THREE.MathUtils.degToRad(180)
        );

        bookWrapper.scale.set(
          2.2,
          2,
          2
        );

        scene.add(bookWrapper);
        const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

        const shadowCanvas = document.createElement("canvas");
        shadowCanvas.width = 256;
        shadowCanvas.height = 256;
        const shadowCtx = shadowCanvas.getContext("2d");
        const shadowGradient = shadowCtx.createRadialGradient(
          128, 128, 0,
          128, 128, 128
        );
        shadowGradient.addColorStop(0, "rgba(0,0,0,0.6)");
        shadowGradient.addColorStop(0.7, "rgba(0,0,0,0.25)");
        shadowGradient.addColorStop(1, "rgba(0,0,0,0)");
        shadowCtx.fillStyle = shadowGradient;
        shadowCtx.fillRect(0, 0, 256, 256);

        const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

        const shadowMaterial = new THREE.MeshBasicMaterial({
          map: shadowTexture,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          side: THREE.DoubleSide,
        });

        const SHADOW_OFFSET_X = 0;
        const SHADOW_OFFSET_Y = -8;
        const SHADOW_OFFSET_Z = 0;

        const shadowGeometry = new THREE.PlaneGeometry(40, 25);

        const shadowMesh = new THREE.Mesh(
          shadowGeometry,
          shadowMaterial
        );

        shadowMesh.rotation.x = -Math.PI / 2;
        shadowMesh.renderOrder = -1;

        shadowMesh.position.set(
          SHADOW_OFFSET_X,
          SHADOW_OFFSET_Y,
          SHADOW_OFFSET_Z
        );

        bookWrapper.add(shadowMesh);

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

  if (!mixer || actions.length === 0) {
    return;
  }

  if (progress <= 0.32) {
    
    const pageProgress = gsap.utils.mapRange(
      0,
      0.32,
      0,
      0.32,
      progress
    );

    const t = pageProgress * totalDuration;

    actions.forEach((action) => {
      action.time = t;
    });

    mixer.update(0);


   

    //camera before 32 frame 

     camera.position.x = THREE.MathUtils.lerp(
    1.208,
    3,
    progress / 0.32
  );

  camera.position.y = THREE.MathUtils.lerp(
    -135.43,
    -90,
    progress / 0.32
  );

  camera.position.z = THREE.MathUtils.lerp(
    32.593,
    25,
    progress / 0.32
    
  );


  // mesh position
  bookWrapper.rotation.z = THREE.MathUtils.degToRad(
    185
  );


  }

  if (
    progress >= 0.32 &&
    progress <= 0.50
  ) {
    const cameraProgress =
      gsap.utils.mapRange(
        0.32,
        0.50,
        0,
        1,
        progress
      );

 

     camera.position.x = THREE.MathUtils.lerp(
    1.208,
    2,
    progress / 0.32
  );

     camera.position.z = THREE.MathUtils.lerp(
    32.593,
    34,
    progress / 0.32
    
  );

     camera.position.x = THREE.MathUtils.lerp(
    2,
    3,
    progress / 0.32
  );

  camera.position.y = THREE.MathUtils.lerp(
    -135.43,
    -85,
    progress / 0.32
  );

 

 


    camera.position.z = THREE.MathUtils.lerp(
    34,
    36,
    progress / 0.32
    
  );

    camera.position.z = THREE.MathUtils.lerp(
    36,
    38,
    progress / 0.32
    
  );

    camera.position.z = THREE.MathUtils.lerp(
    32.593,
    40,
    progress / 0.32
    
  );

  camera.rotation.z = THREE.MathUtils.lerp(
  THREE.MathUtils.degToRad(-4.7326),
  THREE.MathUtils.degToRad(-5),
  progress / 0.32
);


  camera.rotation.x = THREE.MathUtils.lerp(
  THREE.MathUtils.degToRad(89.813),
  THREE.MathUtils.degToRad(85),
  progress / 0.32
);

//-0.91 for y value 


  }

  if (
    progress >= 0.50 &&
    progress <= 0.64
  ) {
    const pageProgress =
      gsap.utils.mapRange(
        0.50,
        0.64,
        0.32,
        0.64,
        progress
      );

    const t =
      pageProgress * totalDuration;

    actions.forEach((action) => {
      action.time = t;
    });

    mixer.update(0);
  }

  if (
    progress >= 0.64 &&
    progress <= 0.82
  ) {
    const cameraProgress =
      gsap.utils.mapRange(
        0.64,
        0.82,
        0,
        1,
        progress
      );

    camera.position.x =
      THREE.MathUtils.lerp(
        3,
        -3,
        cameraProgress
      );

    camera.position.y =
      THREE.MathUtils.lerp(
        -125,
        -145,
        cameraProgress
      );

    camera.position.z =
      THREE.MathUtils.lerp(
        20,
        22,
        cameraProgress
      );
  }

  if (progress >= 0.82) {
    const pageProgress =
      gsap.utils.mapRange(
        0.82,
        1,
        0.64,
        1,
        progress
      );

    const t =
      pageProgress * totalDuration;

    actions.forEach((action) => {
      action.time = t;
    });

 
    // bookWrapper.rotation.z= THREE.utils.degToRad(190)


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
      className="h-[100vh] w-full bg-white"
    >
      <div
        ref={canvasContainerRef}
        className="h-full w-full"
      />
    </div>
  );
};