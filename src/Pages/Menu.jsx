
import React, { useRef, forwardRef, useImperativeHandle, useEffect, useState } from "react";

import {gsap } from "gsap";

//images 
import defaultImg from '../assets/img.webp'
import aboutImg from '../assets/img.webp'; // Make sure these paths exist
import projectsImg from '../assets/projects.jpg';
import skillsImg from '../assets/skills.jpg';
import contactImg from '../assets/contact.jpg';

const Menu =  forwardRef(({  }, ref) => {

  const [imgSrc, setImgSrc] = useState(defaultImg);
  const imgRef = useRef(null);

  // hover animation and functions 
useEffect(() => {
  let ctx = gsap.context(() => {
    if (imgRef.current) {
      // KILL any currently running animations on the image first
      gsap.killTweensOf(imgRef.current);

      gsap.fromTo(imgRef.current, 
        { 
          opacity: 0,
          scale: 1.1,             // Starts slightly zoomed in
          filter: "blur(8px)",    // Adds that "dreamy" blend start
          y: 10                   // Tiny bit of movement
        }, 
        { 
          opacity: 1, 
          scale: 1, 
          filter: "blur(0px)",    // Clears the blur
          y: 0,
          duration: 2,          // Slightly longer for smoothness
          ease: "expo.out"        // Luxury easing
        }
      );
    }
  });
  return () => ctx.revert();
}, [imgSrc]);

  // --- HOVER FUNCTIONS ---
  const handleMouseEnter = (e, newImage) => {
    if (imgSrc !== newImage) setImgSrc(newImage);
    const underline = e.currentTarget.querySelector(".menu-underline");
    gsap.to(underline, { width: "100%", duration: 0.6,ease: "elastic.out(1, 0.5)",overwrite:true });
  };

  const handleMouseLeave = (e) => {
    const underline = e.currentTarget.querySelector(".menu-underline");
    gsap.to(underline, { width: "0%", duration: 0.3 });
  };


  return (
    <div className='fixed top-0 left-0 h-screen w-screen bg-white z-50 will-change-transform backface-hidden transform-gpu'
     style={{ transform: "translateY(-100%)", paddingTop: "12vh" }} ref={ref}>
    
    <div className="main  h-full w-full mt-5  ">
      <div className="top flex justify-center items-center gap-20 h-[85%]">

        <div className="left w-[22%]  h-[90%] menu-inside-photo overflow-hidden ">
          <img key={imgSrc} 
              src={imgSrc}
              ref={imgRef}
               className="object-cover h-full w-full transition-opacity duration-300" />
        </div>
      <div className="right w-[30%]  h-full flex flex-col py-20">
        <div className="first-menu  flex flex-col h-[70%] text-4xl font-bold gap-5">


          <div
          className="relative cursor-pointer w-fit group"
                onMouseEnter={(e) => handleMouseEnter(e, aboutImg)}
                onMouseLeave={handleMouseLeave}>
            <p>About</p>
            <div className="menu-underline absolute bottom-0 left-0 w-0 h-0.5 bg-black"></div>
          </div>

             <div
          className="relative cursor-pointer w-fit group"
                onMouseEnter={(e) => handleMouseEnter(e, projectsImg)}
                onMouseLeave={handleMouseLeave}>
            <p>Projects</p>
            <div className="menu-underline absolute bottom-0 left-0 w-0 h-0.5 bg-black"></div>
          </div>
          
             <div
          className="relative cursor-pointer w-fit group"
                onMouseEnter={(e) => handleMouseEnter(e, skillsImg)}
                onMouseLeave={handleMouseLeave}>
            <p>Skills</p>
            <div className="menu-underline absolute bottom-0 left-0 w-0 h-0.5 bg-black"></div>
          </div>

            <div
          className="relative cursor-pointer w-fit group"
                onMouseEnter={(e) => handleMouseEnter(e, contactImg)}
                onMouseLeave={handleMouseLeave}>
            <p>Contact</p>
            <div className="menu-underline absolute bottom-0 left-0 w-0 h-0.5 bg-black"></div>
          </div>


          
        </div>
        <div className="socialmedia  flex flex-col text-lg">
           <p>Linkedin</p>
          <p>Github</p>
          <p>Instagram</p>
          <p>Twitter</p>

        </div>
      </div>

      </div>

      <div className="bottom  w-full px-35 flex justify-between ">
        <p>Play Reel</p>
        <p className="ml-50">Our Story</p>
        <p>Now Hiring</p>
      </div>
      
    </div>
     </div>
  )
});

export default Menu