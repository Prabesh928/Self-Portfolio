import React, { useEffect, useRef, forwardRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scene } from "../components/Scene";
import { gsap } from "gsap";
import Landingtext from "../components/Landingtext";


gsap.registerPlugin(ScrollTrigger);

const Landingpage = forwardRef(({ navbarRef, intro, setintro }, landing) => {
  const sceneRef = useRef(null);
  const textRef = useRef(null);

 
 useEffect(() => {
  if (!landing.current) return;

  if (intro) {
    // unchanged — snap to final state for Home revisits
    document.body.style.cursor = "auto";
    document.body.classList.remove("loading");
    let checkReady = setInterval(() => {
      const scene = sceneRef.current;
      const text = textRef.current;
      if (!scene || !text) return;
      if (scene.isReady() && scene.cameraMove() && scene.laptopOpen() && text.isReady()) {
        clearInterval(checkReady);
        [scene.cameraMove(), scene.laptopOpen(), scene.keyLightsOn(), scene.laptopBack()]
          .forEach((t) => t?.progress(1));
        text.complete();
      }
    }, 100);
    return () => clearInterval(checkReady);
  }

  document.body.style.cursor = "none";
  document.body.classList.add("loading");

  let cancelled = false;
  let checkReady;
  let ctx;

  const runIntro = () => {
    ctx = gsap.context(() => {
      const scene = sceneRef.current;
      const cameraTl = scene.cameraMove();
      const laptopTl = scene.laptopOpen();
      const keyLightsTl = scene.keyLightsOn();
      const laptopBackTl = scene.laptopBack();

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.body.style.cursor = "auto";
          document.body.classList.remove("loading");
          textRef.current?.play();
          
          // setintro(true);
        },
      });

      tl.fromTo(landing.current, { y: 700 }, { y: 0, duration: 1 });
      tl.call(() => navbarRef.current?.startAnimation());

      const sceneEl = landing.current.querySelector(".scene");
      if (sceneEl) tl.from(sceneEl, { y: 50, opacity: 0, duration: 1.5 }, "-=0.5");

      if (cameraTl) tl.add(cameraTl.play());
      if (laptopTl) tl.add(laptopTl.play(), "-=0.5");
      if (keyLightsTl) {
        tl.add(
          keyLightsTl.play().eventCallback("onStart", () => {
            if (window.startPortfolioTyping) window.startPortfolioTyping();
          })
        );
      }
      if (laptopBackTl) tl.add(laptopBackTl.play());
    }, landing);
  };

  checkReady = setInterval(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (scene.isReady() && scene.cameraMove() && scene.laptopOpen()) {
      clearInterval(checkReady);
      if (!cancelled) runIntro();
    }
  }, 100);

  return () => {
    cancelled = true;
    clearInterval(checkReady);
    document.body.style.cursor = "auto";
    ctx?.revert();
  };
}, [landing, navbarRef, setintro, intro]);

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

          const BASE_ROT_Y = 6.28318;

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

      return () => {
        clearInterval(checkReady);
        if (scrollAnim) scrollAnim.kill();
      };
    }, landing);

    return () => ctx.revert();
  }, [intro]);

  return (
    <div ref={landing} className="bg-[#0b0b0f] h-[110vh] relative">
      <Scene
        ref={sceneRef}
        className="scene fixed   inset-0 bg-[#0b0b0f] z-0 pointer-events-none block"
      />

      <div className="absolute left-100 top-45 -translate-y-1/2 z-20">
        {/* <Landingtext ref={textRef} /> */}
          <Landingtext ref={textRef} onComplete={() => setintro(true)} />
      </div>
      
    </div>
  );
});

export default Landingpage;