import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lottie from "lottie-react";

import runningman from "../assets/cyclewalk.json";
import Nodejs from "../assets/Nodejs.json";
import reactlogo from "../assets/reactlogo.json";
import JavaScript from "../assets/JavaScript.json";
import FootSound from '../assets/sounds/footstep.mp3';

// Icon Imports
import { SiMongodb } from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaCss3Alt } from "react-icons/fa";
import { FaHtml5 } from "react-icons/fa6";
import { TbBrandThreejs } from "react-icons/tb";
import { TbBrandFramerMotion } from "react-icons/tb";
import { IoLogoNodejs } from "react-icons/io5";
import { SiExpress } from "react-icons/si";
import { SiMysql } from "react-icons/si";
import { TbApi } from "react-icons/tb";
import { SiJsonwebtokens } from "react-icons/si";
import { RiReactjsFill } from "react-icons/ri";  
import { SiTailwindcss } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { SiGreensock } from "react-icons/si";
import { SiThreedotjs } from "react-icons/si";
import { SiBlender } from "react-icons/si";
import { DiPhotoshop } from "react-icons/di";
import { FaDatabase } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaJira } from "react-icons/fa";
import { FaTrello } from "react-icons/fa";
import { SiClaude } from "react-icons/si";
import { IoLogoVercel } from "react-icons/io5";
import { SiRender } from "react-icons/si";


import Skillcard from './Skillcard';

// Array of objects containing card content AND their unique positioning/GSAP classes
// Array of objects containing card content AND their unique positioning/GSAP classes
const cardsData = [
  {
    id: 1,
    className: "absolute top-48 stacking-first z-10",
    title: "Full-Stack MERN Architecture",
    subtitle: "Backend and Database engineering",
    skills: [
      { icon: IoLogoNodejs, color: "text-green-600", name: "NodeJs" },
      { icon: SiExpress, color: "", name: "ExpressJS" },
      { icon: TbApi, color: "text-blue-600", name: "REST APIs" },
      { icon: SiJsonwebtokens, color: "text-pink-600", name: "JWT/Auth" },
      { icon: SiMongodb, color: "text-green-500", name: "MongoDB" },
      { icon: SiMysql, color: "text-blue-500", name: "MySQL" }
    ],
    footer: ["✔ Secure Authentication", "✔ RESTful Routing", "✔ Database Optimization"]
  },
  {
    id: 2,
    className: "absolute top-30 left-20 stacking-second z-20",
    title: "3D & Interactive Frontend",
    subtitle: "Immersive web experiences",
    skills: [
      { icon: RiReactjsFill, color: "text-cyan-400", name: "React.js" },
      { icon: SiTailwindcss, color: "text-cyan-500", name: "Tailwind CSS" },
      { icon: IoLogoJavascript, color: "text-yellow-400", name: "JavaScript" },
      { icon: SiGreensock, color: "text-green-500", name: "GSAP" },
      { icon: SiThreedotjs, color: "text-black", name: "Three.js" },
      { icon: TbBrandFramerMotion, color: "text-purple-500", name: "Framer Motion" },
      { icon: SiBlender, color: "text-orange-500", name: "Blender" },
      { icon: DiPhotoshop, color: "text-blue-600", name: "Photoshop" }
    ],
    footer: ["✔ 3D Interactions", "✔ Scroll Trigger FX", "✔ Fluid Animations"]
  },
  {
    id: 3,
    className: "absolute right-20 top-22 stacking-third z-30",
    title: "Data Analytics & Tools",
    subtitle: "Development workflow & insights",
    skills: [
      { icon: FaDatabase, color: "text-blue-500", name: "Database" },
      { icon: FaGithub, color: "text-black", name: "GitHub" },
      { icon: FaJira, color: "text-blue-600", name: "Jira" },
      { icon: FaTrello, color: "text-blue-400", name: "Trello" },
      { icon: SiClaude, color: "text-orange-500", name: "Claude" },
      { icon: IoLogoVercel, color: "text-black", name: "Vercel" },
      { icon: SiRender, color: "text-blue-500", name: "Render" }
    ],
    footer: ["✔ Version Control", "✔ Project Tracking", "✔ Deployment & AI"]
  }
];
const Stackingdiv = () => {
  const secondcontainer = useRef(null);
  const lottieRef = useRef();

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: secondcontainer.current,
          pin: true,
          scrub: 1,
          start: "+=185 15%",
          end: "+=900",
        },
      });

      tl.fromTo(
        ".stacking-second",
        { yPercent: 100, opacity: 0, scale: 0.3 },
        { yPercent: 20, opacity: 1, duration: 1, scale: 1 },
      )
      .fromTo(
        ".stacking-third",
        { yPercent: 100, opacity: 0, scale: 0.3 },
        { yPercent: 27, opacity: 1, duration: 1, scale: 1 },
      );
    },
    { scope: secondcontainer },
  );

  useGSAP(
    () => {
      let lastX = -window.innerWidth;
      let lastStepX = -window.innerWidth;
      const STEP_DISTANCE = 90; 

      const singleStepSound = new Audio(FootSound);
      singleStepSound.volume = 0.6;

      gsap.fromTo(
        ".lottie-class",
        { x: -window.innerWidth, scaleX: 1 },
        {
          x: window.innerWidth,
          ease: "none",
          scrollTrigger: {
            trigger: secondcontainer.current,
            start: "top top",
            end: "+=2000",
            scrub: 0.8,
            onUpdate: (self) => {
              const currentX = gsap.getProperty(".lottie-class", "x");

              if (currentX > lastX) {
                gsap.to(".lottie-class", { scaleX: 1, duration: 0.1 });
              } else {
                gsap.to(".lottie-class", { scaleX: -1, duration: 0.1 });
              }
              lastX = currentX;

              if (Math.abs(self.getVelocity()) > 5) {
                lottieRef.current?.play();
              } else {
                lottieRef.current?.pause();
              }

              if (Math.abs(currentX - lastStepX) >= STEP_DISTANCE) {
                const soundClone = singleStepSound.cloneNode();
                soundClone.play().catch(() => {});
                lastStepX = currentX;
              }
            },
            onLeave: () => lottieRef.current?.pause(),
            onLeaveBack: () => lottieRef.current?.pause(),
          },
        }
      );
    },
    { scope: secondcontainer }
  );

  return (
    <div
      className="h-[110vh] w-full relative flex justify-center items-center"
      ref={secondcontainer}
    >
      <div className="foricons absolute top-5 w-full h-[10%] flex justify-center items-center gap-25">
        <div className="firsticon w-[5%] h-full">
          <Lottie animationData={JavaScript} autoplay={true} />
        </div>
        <div className="secondicon w-[5%] h-full">
          <Lottie animationData={Nodejs} autoplay={true} />
        </div>
        <div className="thirdicon w-[5%] h-full">
          <Lottie animationData={reactlogo} autoplay={true} />
        </div>
        <div className="thirdicon w-[5%] h-full flex justify-center items-center">
          <SiMongodb className="w-[60%] h-[60%]" />
        </div>
        <div className="thirdicon w-[5%] h-full flex justify-center items-center">
          <RiTailwindCssFill className="w-[60%] h-[60%]" />
        </div>
        <div className="thirdicon w-[5%] h-full flex justify-center items-center">
          <FaCss3Alt className="w-[60%] h-[60%]" />
        </div>
        <div className="thirdicon w-[5%] h-full flex justify-center items-center">
          <TbBrandThreejs className="w-[60%] h-[60%]" />
        </div>
        <div className="thirdicon w-[5%] h-full flex justify-center items-center">
          <TbBrandFramerMotion className="w-[60%] h-[60%]" />
        </div>
      </div>

      {/* lottie animation */}
      <div className="absolute bottom-2 h-20 w-20 lottie-class">
        <Lottie
          lottieRef={lottieRef}
          animationData={runningman}
          autoplay={false}
          style={{ width: "120px", height: "120px", zIndex: "50" }}
        />
      </div>

      {/* Map through the array and pass className cleanly */}
      {cardsData.map((card) => (
        <Skillcard 
          key={card.id}
          title={card.title}
          subtitle={card.subtitle}
          skills={card.skills}
          footer={card.footer}
          className={card.className}
        />
      ))}
    </div>
  );
};

export default Stackingdiv;