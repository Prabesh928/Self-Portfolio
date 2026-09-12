import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Project from "./Project";
import Projectdetails from "./Projectdetails";

import Navbar from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

const PageTransition = ({
  introPlayed,
  setIntroPlayed
}) => {

  const location = useLocation();

  const [oldLocation, setOldLocation] = useState(null);

  const previousLocation = useRef(location);

  const oldPageRef = useRef(null);
  const newPageRef = useRef(null);

  const lenisRef = useRef(null);


  // =========================
  // LENIS SMOOTH SCROLL
  // =========================
  useEffect(() => {

    const lenis = new Lenis({
      duration: 1.6,
      smoothWheel: true,
      smoothTouch: false,
      easing: (t) => 1 - Math.pow(1 - t, 2.5)
    });

    console.log("✅ Lenis initialized");

    lenisRef.current = lenis;


    // Connect Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);


    // DEBUG - Check if Lenis is scrolling
    lenis.on("scroll", (e) => {
      console.log("LENIS SCROLL:", e.scroll);
    });


    let rafId;

    const raf = (time) => {

      lenis.raf(time);

      rafId = requestAnimationFrame(raf);

    };


    rafId = requestAnimationFrame(raf);


    setTimeout(() => {
  ScrollTrigger.refresh();
}, 500);


    return () => {

      cancelAnimationFrame(rafId);

      lenis.destroy();

      lenisRef.current = null;

    };

  }, []);


  // =========================
  // REFRESH SCROLLTRIGGER
  // ON WINDOW RESIZE
  // =========================
  useEffect(() => {

    const handleResize = () => {

      ScrollTrigger.refresh();

    };


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);


  // =========================
  // HANDLE PAGE CHANGE
  // =========================
  useEffect(() => {

    if (
      previousLocation.current.pathname !==
      location.pathname
    ) {

      console.log(
        "OLD:",
        previousLocation.current.pathname
      );

      console.log(
        "NEW:",
        location.pathname
      );


      // Save previous page
      setOldLocation(
        previousLocation.current
      );


      // Update current page
      previousLocation.current = location;


      // Scroll to top using Lenis
      lenisRef.current?.scrollTo(
        0,
        {
          immediate: true
        }
      );

    }

  }, [location]);


  // =========================
  // NAVBAR THEME
  // =========================
  const themeMap = {

    "/about": "light",

    "/contact": "light",

    "/projects": "dark"

  };


  const theme =
    themeMap[location.pathname] ||
    "dark";


  // =========================
  // PAGE TRANSITION
  // =========================
  useEffect(() => {

    if (!oldLocation) return;


    const tl = gsap.timeline({

      onComplete: () => {

        setOldLocation(null);

        ScrollTrigger.refresh();

      }

    });


    tl.fromTo(

      newPageRef.current,

      {
        y: "-120%",
        skewY: 7,
        transformOrigin: "right top"
      },

      {
        y: "0%",
        skewY: 0,

        duration: 1.5,

        ease: "expo.out"
      }

    );


    return () => {

      tl.kill();

    };

  }, [oldLocation]);


  // =========================
  // ROUTES
  // =========================
  const AppRoutes = ({
    routeLocation
  }) => (

    <Routes
      location={routeLocation}
    >

      <Route
        path="/"
        element={
          <Home
            introPlayed={introPlayed}
            setIntroPlayed={setIntroPlayed}
          />
        }
      />


      <Route
        path="/about"
        element={<About />}
      />


      <Route
        path="/contact"
        element={<Contact />}
      />


      <Route
        path="/projects"
        element={<Project />}
      />

      <Route 
  path="/projects/:id" 
  element={<Projectdetails />} 
/>

    </Routes>

  );


  // =========================
  // RETURN
  // =========================
  return (

    <div className="relative min-h-screen">


      {/* NAVBAR */}

      {location.pathname !== "/" && (

        <Navbar theme={theme} />

      )}


      {/* OLD PAGE */}

      {oldLocation && (

        <div
          ref={oldPageRef}
          className="
            absolute
            inset-0
            z-10
            w-full
          "
        >

          <AppRoutes
            routeLocation={oldLocation}
          />

        </div>

      )}


      {/* NEW PAGE */}

      <div

        ref={newPageRef}

        className={
          oldLocation

            ? `
              absolute
              inset-0
              z-20
              w-full
            `

            : `
              relative
              z-20
              w-full
            `
        }

      >

        <AppRoutes
          routeLocation={location}
        />

      </div>


    </div>

  );

};


export default PageTransition;