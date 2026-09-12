
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Workcard from "../components/Workcard";
import { CustomEase } from "gsap/CustomEase";
import { projects } from "../assets/projectdata";



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
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const handleProjectClick = (project) => {
  

  const work = container.current.querySelector(
    `.work-${project.id}`
  );

  const smallimg = work.querySelector(".smallimg");

  gsap.to(smallimg, {
     yPercent: 105,
          duration:2,
          ease: "thirasEase",

    onComplete: () => {
      navigate(`/projects/${project.id}`);
    }
  });
};

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
          yPercent: -110,
          duration:2 ,
          scale:1.2,
          ease: "thirasEase",
        },
        0
      );

      tl.to(
        smallimg,
        {
          yPercent: 105,
          duration:2,
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
          duration: 1,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        nextText,
        {
          opacity: 1,
          y: 0,
          duration:1,
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
              onClick={() => handleProjectClick(project)}
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

