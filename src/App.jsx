import React, { useEffect, useRef, useState } from "react";
import Landingpage from "./Pages/Landingpage";
import Navbar from "./components/Navbar"
import Workpage from "./Pages/Workpage";
import { gsap } from "gsap";
import Lenis from "lenis";
import Menu from './Pages/Menu'
import Works from './Pages/Works'
import Skills from "./Pages/Skills";
import Stackingdiv from "./components/Stackingdiv";


function App() {
  const cursor = useRef(null);
  const landing = useRef(null);
  const lenisRef = useRef(null); 
    const navbarRef = useRef(null);
    const [intro , setintro ] =useState(false);
    const [menuopen, setmenuopen]=useState(false);
    const menuRef = useRef(null)

    //for cursor 
    useEffect(() => {
  if (!intro) return;
  const cursorEl = cursor.current;
  if (!cursorEl) return;

  const ctx = gsap.context(() => {
    const xTo = gsap.quickTo(cursorEl, "x", { duration: 0.7, ease: "back.out" });
    const yTo = gsap.quickTo(cursorEl, "y", { duration: 0.7, ease: "back.out" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, cursorEl);

  return () => ctx.revert();
}, [intro]);




// menu animation
useEffect(() => {
  const element = menuRef.current;
  if (!element) return;

  const photo = element.querySelector(".menu-inside-photo");
  const paragraphs = element.querySelectorAll("p");

  gsap.killTweensOf([element, photo, paragraphs]);

  const tl = gsap.timeline();

  if (menuopen) {
    // --- ANIMATE IN (Entrance) ---
    tl.set(element, { autoAlpha: 1 }); 
    
    // 1. Panel Drops Down
    tl.fromTo(element, 
      { y: "-120%", skewY: 7, transformOrigin: "right top" }, 
      { y: "0%", skewY: 0, duration: 1.5, ease: "expo.out" }
    );

    // 2. Photo drops down into view
    tl.fromTo(photo,
      { y: -100, opacity: 0 }, // Changed to negative to drop from TOP
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" },
      "-=1" 
    );

    // 3. TEXT ANIMATION (Opposite Swipe - Dropping from TOP)
    tl.fromTo(paragraphs,
      { 
        y: -40,      // Start 40px HIGHER
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: "power3.out", 
        stagger: 0.08 // The "swipe" effect
      },
      "-=0.7" // Overlap with the panel settling
    );

  } else {
    // --- ANIMATE OUT (Exit) ---
    // Keep your exit swipe as it was (dropping down and out)
    tl.to([photo, paragraphs], {
      y: 30,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in"
    });

    tl.to(element, { 
      y: "-130%", 
      skewY: -7,
      transformOrigin: "right top",
      autoAlpha: 1, 
      duration: 1.1, 
      ease: "expo.inOut" 
    }, "-=0.2");

    tl.set(element, { skewY: 0 });
  }

  return () => tl.kill();
}, [menuopen]);


//for lenis scroll
useEffect(() => {
  if (!intro) return;
  if (!lenisRef.current) {
    lenisRef.current = new Lenis({ duration: 1.6, smooth: true, smoothTouch: false, easing: t => 1 - Math.pow(1 - t, 2.5) });
  }

  let rafId;
  const raf = (time) => {
    lenisRef.current?.raf(time);
    rafId = requestAnimationFrame(raf);
  };

  rafId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(rafId);
    lenisRef.current?.destroy();
    lenisRef.current = null;
  };
}, [intro]);






  return (
    <div className="bg-white min-h-screen">
      <Menu ref={menuRef}/>
      <Navbar landing={landing} ref={navbarRef} menuopen={menuopen} setmenuopen={setmenuopen} className="fixed top-0 left-0  opacity-100 " />
      <div
        ref={cursor}
       className={`fixed top-0 left-0 z-100 pointer-events-none
    bg-white/80 backdrop-blur-md
    h-14 w-14 rounded-full
    flex items-center justify-center
    transition-opacity duration-500
    ${intro ? "opacity-100" : "opacity-0"}`}
      >
        <p>Scroll</p>
      </div>

      <Landingpage ref={landing} navbarRef={navbarRef} intro={intro} setintro={setintro} />
    
      <Skills />
      <Stackingdiv/>
      <Workpage />
      <Works/>
    </div>
  );
}

export default App;
