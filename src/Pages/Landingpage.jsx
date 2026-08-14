import React, { useEffect, useRef, useState, forwardRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scene } from "../components/Scene";
import { gsap } from "gsap";
import Landingtext from "../components/Landingtext";

gsap.registerPlugin(ScrollTrigger);

const Landingpage = forwardRef(({ navbarRef, intro, setintro }, landing) => {
  const sceneRef = useRef(null);
  const textRef = useRef(null);

  // --- Master timeline for landing intro ---
  useEffect(() => {
    if (!landing.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 0️⃣ Full page fade-in
      tl.fromTo(
        landing.current,
        { y: 700, alpha: 1 },
        { y: 0, alpha: 1, duration: 1, ease: "expoScale(0.5,7,none)" }
      );

      // Call navbar animation
      tl.call(() => {
        if (navbarRef?.current) navbarRef.current.startAnimation();
      });

      // 3️⃣ Animate Scene component appearance
      const sceneEl = landing.current.querySelector(".scene");
      if (sceneEl) {
        tl.from(sceneEl, { y: 50, opacity: 0, duration: 1.5 }, "-=0.5");
      }

      // --- Wait for Scene to be ready ---
      let checkReady = setInterval(() => {
        const scene = sceneRef.current;
        if (!scene) return;

        if (scene.isReady() && scene.cameraMove() && scene.laptopOpen()) {
          clearInterval(checkReady);

          const cameraTl = scene.cameraMove();
          const laptopTl = scene.laptopOpen();
          const keyLightsTl = scene.keyLightsOn();
          const laptopBackT1 = scene.laptopBack();

          if (cameraTl) tl.add(cameraTl.play());
          if (laptopTl) tl.add(laptopTl.play(), "-=0.5");
          if (keyLightsTl) {
            tl.add(
              keyLightsTl.play().eventCallback("onStart", () => {
                if (window.startPortfolioTyping) window.startPortfolioTyping();
              })
            );
          }
          if (laptopBackT1) tl.add(laptopBackT1.play());

          tl.call(() => {
            textRef.current?.play();
            setintro(true);
          });
        }
      }, 100);

      // Cleanup interval on unmount
      return () => clearInterval(checkReady);
    }, landing);

    return () => ctx.revert();
  }, [landing, navbarRef, setintro]);

  // --- Laptop rotation linked to scroll ---
  useEffect(() => {
    if (!intro || !landing.current) return;

    const ctx = gsap.context(() => {
      let scrollAnim;
      let checkReady = setInterval(() => {
        const scene = sceneRef.current;
        if (!scene) return;

        const laptopObject = scene.getLaptopObject();
        if (laptopObject) {
          clearInterval(checkReady);

          const BASE_ROT_Y = 5.58319;

          scrollAnim = gsap.fromTo(
            laptopObject.rotation,
            { y: BASE_ROT_Y },
            {
              y: BASE_ROT_Y - Math.PI * 2,
              ease: "none",
              scrollTrigger: {
                trigger: landing.current,
                start: "0",
                end: "bottom top",
                scrub: 8,
                immediateRender: false,
              },
            }
          );
        }
      }, 100);

      // Cleanup
      return () => {
        clearInterval(checkReady);
        if (scrollAnim) scrollAnim.kill();
      };
    }, landing);

    return () => ctx.revert();
  }, [intro]);

  return (
    <div
      ref={landing}
      className="bg-[#0b0b0f] h-[110vh] relative"
    >
      <Scene
        ref={sceneRef}
        className="scene fixed inset-0 bg-[#0b0b0f] z-0 pointer-events-none block"
      />

      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20">
        <Landingtext ref={textRef} />
      </div>
    </div>
  );
});

export default Landingpage;
