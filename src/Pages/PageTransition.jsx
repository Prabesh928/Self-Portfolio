import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";

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

  const themeMap = {
    "/about": "light",
    "/contact": "light",
    "/projects": "dark",
  };

  const theme =
    themeMap[location.pathname] || "dark";

  return (
    <>
      {location.pathname !== "/" && (
        <Navbar theme={theme} />
      )}

      <Routes>
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
      </Routes>
    </>
  );
};

export default PageTransition;