import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Navbar from "./components/Navbar";
import Project from "./Pages/Project";
import { useState } from "react";

function AppContent() {

  const location = useLocation();
  
  const [introPlayed, setIntroPlayed] = useState(false);
  const themeMap = {
    "/about": "light",
    "/contact": "light",
    "/projects": "dark", // adjust to whatever each page's background actually is
  };

  const theme = themeMap[location.pathname] || "dark";

  return (
    <>
      {location.pathname !== "/" && <Navbar theme={theme}  />}
      

      <Routes>
        <Route path="/" element={<Home introPlayed={introPlayed} setIntroPlayed={setIntroPlayed} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Project />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;