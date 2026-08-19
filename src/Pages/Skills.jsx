import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lottie from "lottie-react";
import Stackingdiv from "../components/Stackingdiv";
import eye from '../assets/eye.json'
import { LuSparkle } from "react-icons/lu";
import imageone from '../assets/img.webp'
import imagetwo from '../assets/imagetwo.webp'

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  "HTML", "CSS", "JAVASCRIPT", "REACT.JS", "NODE.JS", "EXPRESS.JS", "MONGODB", "THREE.JS", "GSAP", "TAILWIND CSS", "REST APIS", "BCRYPT", "GIT", "UI/UX", "ANIMATION", "POWERAPPS", "FIGMA", "JIRA", "FRAMER MOTION", "JSON", "AJAX", "FETCH API", "AXIOS", "RESPONSIVE DESIGN", "Cloudinary", "JWT", "SERVER-SIDE RENDERING", "CLIENT-SIDE RENDERING", "MIDDLEWARE", "ROUTING", "ERROR HANDLING", "TESTING", "UNIT TESTING", "INTEGRATION TESTING", "DEPLOYMENT", "CI/CD", "HEROKU", "NETLIFY", "VERCEL", "AWS", "FIREBASE", "GRAPHQL", "APOLLO CLIENT", "SOCKET.IO", "REAL-TIME CHAT", "WEB ANIMATION", "INTERACTIVE UI", "LIGHTHOUSE AUDIT", "CROSS-BROWSER COMPATIBILITY", "ACCESSIBILITY", "COLOR THEORY", "TYPOGRAPHY", "LAYOUT DESIGN", "UX RESEARCH", "PROTOTYPING"
];

const Skills = () => {
  const container = useRef(null);
  const eyeRef = useRef(null);
  const hasplayRef = useRef(false);

  useGSAP(()=>{

  gsap.fromTo(".blink-eye",
  { opacity: 0, y: -100 },     // ← fromVars (starting values)
  { 
    opacity: 1, 
    y: 0, 
    duration: 2,  
    ease: "bounce.out",          // ← toVars (ending values + animation settings)
    scrollTrigger: {           // ← scrollTrigger must be **here**, as part of toVars
      trigger: container.current,
      start: "top 50%",
      toggleActions: "play none none none",
     
      onEnter:()=>{
        if(!hasplayRef.current && eyeRef.current){
          eyeRef.current.play();
          hasplayRef.current=true;
          console.log("Lottie Playing");
        }

      }
   
    }
  }
)





  },{scope:container})


  useGSAP(() => {


    gsap.from(".skill-title", {
      opacity: 0,
      scale: 0.5,
      filter: "blur(10px)",
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".skill-title",
        start: "top 100%",
        end: "top 40%",
        scrub:true
        
         
       
      
      }
    });
    // Select all the span elements inside our container
    const words = gsap.utils.toArray(".skill-word");

    gsap.from(words, {
      opacity: 0,
      y: 30, // Start 30px below
      stagger: 0.1, // Time between each word starting
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container.current,
         
        start: "top 50%", // Start animation when top of container hits 70% of viewport
        end: "bottom+=450 100%", // End when bottom of container hits 20%
        toggleActions: "play none none reverse", // Play on scroll down, reverse on scroll up
        scrub: true
   
       
      },
    });
  }, { scope: container });

 

  return (
    <div className=" text-black h-[280vh]" ref={container}>
      {/* Upper Section */}
      <div className=" w-full p-10 md:p-25 flex flex-col h-[200vh]   ">


        <div className= " ml-45 text-9xl font-bold w-[40%] text-center mt-10 skill-title tracking-widest relative   ">SKILLS
          <span className="absolute  h-8 w-12 -top-7 left-52 rounded-full blink-eye opacity-0">
            <Lottie animationData={eye} autoplay={false} loop={false} lottieRef={eyeRef}  />
          </span>
        </div>

        <div className=" h-full flex w-full gap-30 ">
          <div className=" w-[40%] h-screen ml-45 mt-25">
            <img src={imageone} />
          </div>
          <div className=" w-[30%] h-[90%] flex justify-between flex-col mt-25">
            <div className="w-full h-[23%] bg-white flex flex-col justify-between">
              <div className="upper flex items-center">
                <LuSparkle className="fill-black stroke-black" />
                &nbsp; &nbsp;
                <p className="text-lg">Featured Skills</p>
              </div>
              <div className="down">
                <p className="text-2xl">Specializing in interactive 3D web experiences and scalable full-stack applications. I bridge the gap between creative visual design and engineering using Three.js, GSAP, and React to craft fluid, performance driven digital products.</p>
              </div>


            </div>
            <div className="w-full h-[50%] bg-blue-300">
              <img src={imagetwo} />
            </div>
          </div>
        </div>

        
       
        
     

     
        
         
        
       
       
      </div>
         {/* The Skill Cloud Area */}
         <div className=" flex w-full justify-center items-center">
            <div className="mt-20 w-full  flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-5xl leading-relaxed">
          {WORDS.map((word, index) => (
            <span 
              key={index} 
              className="skill-word text-2xl inline-block "
            >
              {word}{index !== WORDS.length - 1 && ","}
            </span>
          ))}
        </div>
         </div>
      
    </div>
  );
};

export default Skills;