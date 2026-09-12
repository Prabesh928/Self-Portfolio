
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Workcard from "../components/Workcard";
import { CustomEase } from "gsap/CustomEase";
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
gsap.registerPlugin(CustomEase);
CustomEase.create(
  "thirasEase",
  "M0,0 C0.05,0.88 0.16,1 1,1"
);

CustomEase.create(
  "thirasEaseIn",
  "M0,0 C0.84,0 0.95,0.12 1,1"
);


const Project = () => {
  const container = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  useGSAP(() => {
    let currentIndex = 0;
    let isAnimating = false;

    projects.forEach((project, index) => {
      const work = container.current.querySelector(
        `.work-${project.id}`
      );

      const text = work.querySelector(".text");
      const bigimg = work.querySelector(".bigimg");
      const smallimg = work.querySelector(".smallimg");
   

      gsap.set(text, {
        opacity: index === 0 ? 1 : 0,
        y: index === 0 ? 0 : 50,
      });

      gsap.set(bigimg, {
        yPercent: 0,
      });

      gsap.set(smallimg, {
        yPercent: 0,
      });

        gsap.set(work, {
        zIndex: index === 0 ? 2 : 0,
      });
    });

    const handleWheel = (e) => {
      if (e.deltaY < 0) return;
      if (isAnimating) return;

      isAnimating = true;

      const nextIndex =
        (currentIndex + 1) % projects.length;

      const currentWork = container.current.querySelector(
        `.work-${projects[currentIndex].id}`
      );

      const nextWork = container.current.querySelector(
        `.work-${projects[nextIndex].id}`
      );

      const bigimg =
        currentWork.querySelector(".bigimg");

      const smallimg =
        currentWork.querySelector(".smallimg");

      const currentText =
        currentWork.querySelector(".text");

      const nextText =
        nextWork.querySelector(".text");

        const gradient = currentWork.querySelector(".gradient"); 

     gsap.set(nextWork, {
  zIndex: 1,
});

gsap.set(currentWork, {
  zIndex: 2,
});

      gsap.set(nextText, {
        opacity: 0,
        y: 50,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(currentWork, {
            zIndex: 0,
          });

          gsap.set(bigimg, {
            yPercent: 0,
          });

          gsap.set(smallimg, {
            yPercent: 0,
          });

          gsap.set(currentText, {
            opacity: 0,
            y: 50,
          });

           gsap.set(gradient, { opacity: 1 }); 

          currentIndex = nextIndex;
          setCurrentPage(
  projects[currentIndex].id
);
          isAnimating = false;
        },
      });

      tl.to(
        bigimg,
        {
          yPercent: -105,
          duration: 2,
          ease: "thirasEase",
        },
        0
      );

      tl.to(
        smallimg,
        {
          yPercent: 105,
          duration: 2,
          ease: "thirasEase",
        },
        0
      );

      tl.to(gradient, { opacity: 0, duration: 2, ease: "thirasEase" }, 0); 

    

      tl.to(
        currentText,
        {
          opacity: 0,
          y: -50,
          duration: 0.8,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        nextText,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
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
              zIndex: index === 0 ? 2 : 0,
          }}
        >
          <Workcard
            tittle={project.title}
            description={project.description}
            imgpath={project.image}
          />
        </div>
      ))}

      <div className="absolute bottom-10 right-10 z-50 text-white text-xl">
  {String(currentPage).padStart(2, "0")}
  /
  {String(projects.length).padStart(2, "0")}
</div>


    </div>
  );
};

export default Project;

