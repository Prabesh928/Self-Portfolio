import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Workcard from "../components/Workcard";

import Work1 from "../assets/work1.webp";
import Work2 from "../assets/contact.jpg";
import Work3 from "../assets/work3.jpg";
import Work4 from "../assets/work4.jpg";
import Work5 from "../assets/work5.jpg";
import Work6 from "../assets/work6.jpg";

const projects = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "Modern developer showcase",
    image: Work1,
  },
  {
    id: 2,
    title: "WebSocket Game",
    description: "Real time multiplayer",
    image: Work2,
  },
  {
    id: 3,
    title: "Task Manager",
    description: "Simple productivity platform",
    image: Work3,
  },
  {
    id: 4,
    title: "E-Commerce Store",
    description: "Modern online shopping",
    image: Work4,
  },
  {
    id: 5,
    title: "Social Platform",
    description: "Connect and share",
    image: Work5,
  },
  {
    id: 6,
    title: "Data Dashboard",
    description: "Visualize important insights",
    image: Work6,
  },
];

const Project = () => {
  const container = useRef(null);

  useGSAP(() => {
    let currentIndex = 0;
    let isAnimating = false;

    // =====================================
    // INITIAL TEXT STATE
    // =====================================

    projects.forEach((project, index) => {
      const work = container.current.querySelector(
        `.work-${project.id}`
      );

      const text = work.querySelector(".text");

      // Only first text visible initially
      gsap.set(text, {
        opacity: index === 0 ? 1 : 0,
      });
    });


    const handleWheel = (e) => {

      if (e.deltaY < 0) return;

      if (isAnimating) return;

      if (currentIndex >= projects.length - 1) return;

      isAnimating = true;


      // =====================================
      // CURRENT WORK
      // =====================================

      const currentWork = container.current.querySelector(
        `.work-${projects[currentIndex].id}`
      );

      const bigimg =
        currentWork.querySelector(".bigimg");

      const smallimg =
        currentWork.querySelector(".smallimg");

      const currentText =
        currentWork.querySelector(".text");


      // =====================================
      // NEXT WORK
      // =====================================

      const nextWork = container.current.querySelector(
        `.work-${projects[currentIndex + 1].id}`
      );

      const nextText =
        nextWork.querySelector(".text");


      const tl = gsap.timeline({
        onComplete: () => {
          currentIndex++;
          isAnimating = false;
        },
      });


      // BIG IMAGE → UP
      tl.to(
        bigimg,
        {
          yPercent: -100,
          duration: 1.2,
          ease: "expo.out",
        },
        0
      );


      // SMALL IMAGE → DOWN
      tl.to(
        smallimg,
        {
          yPercent: 120,
          duration: 1.2,
          ease: "expo.out",
        },
        0
      );


      // CURRENT TEXT → OUT
      tl.to(
        currentText,
        {
          opacity: 0,
          y: -50,
          duration: 0.5,
          ease: "power2.out",
        },
        0
      );


      // NEXT TEXT → IN
      tl.fromTo(
        nextText,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        0.3
      );

    };


    container.current.addEventListener(
      "wheel",
      handleWheel
    );


    return () => {
      container.current?.removeEventListener(
        "wheel",
        handleWheel
      );
    };

  }, { scope: container });


  return (
    <div
      ref={container}
      className="relative h-screen w-full overflow-hidden bg-black"
    >

      {projects.map((project, index) => (

        <div
          key={project.id}
          className={`work-${project.id} absolute inset-0`}
          style={{
            zIndex: projects.length - index,
          }}
        >

          <Workcard
            tittle={project.title}
            description={project.description}
            imgpath={project.image}
          />

        </div>

      ))}

    </div>
  );
};

export default Project;