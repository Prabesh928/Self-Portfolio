import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Project from "./Project";

import Navbar from "../components/Navbar";

const PageTransition = ({
  introPlayed,
  setIntroPlayed
}) => {
       
  const location = useLocation();
  const [oldLocation, setOldLocation] = useState(null);
  const previousLocation = useRef(location);
  const oldPageRef = useRef(null);
const newPageRef = useRef(null);

  useEffect(() => {
  if (previousLocation.current.pathname !== location.pathname) {

    console.log("OLD:", previousLocation.current.pathname);
    console.log("NEW:", location.pathname);

    setOldLocation(previousLocation.current);

    previousLocation.current = location;
  }
}, [location]);

  const themeMap = {
    "/about": "light",
    "/contact": "light",
    "/projects": "dark",
  };

  const theme =
    themeMap[location.pathname] || "dark";

    useEffect(() => {
  if (!oldLocation) return;

  const tl = gsap.timeline({
    onComplete: () => {
      setOldLocation(null);
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

  return () => tl.kill();

}, [oldLocation]);

    const AppRoutes = ({ routeLocation }) => (
  <Routes location={routeLocation}>
    <Route
      path="/"
      element={
        <Home
          introPlayed={introPlayed}
          setIntroPlayed={setIntroPlayed}
        />
      }
    />

    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/projects" element={<Project />} />
  </Routes>
);

return (
  <div
    className={
      oldLocation
        ? "relative h-screen overflow-hidden"
        : "relative min-h-screen"
    }
  >

    {location.pathname !== "/" && (
      <Navbar theme={theme} />
    )}

    {/* OLD PAGE */}
    {oldLocation && (
      <div
        ref={oldPageRef}
        className="absolute inset-0 z-10 w-full"
      >
        <AppRoutes routeLocation={oldLocation} />
      </div>
    )}

    {/* NEW PAGE */}
    <div
      ref={newPageRef}
      className={
        oldLocation
          ? "absolute inset-0 z-20 w-full"
          : "relative z-20 w-full"
      }
    >
      <AppRoutes routeLocation={location} />
    </div>

  </div>
);
};

export default PageTransition;