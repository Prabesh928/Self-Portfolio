import React, { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import man from '../assets/man.jpg'

gsap.registerPlugin(ScrollTrigger);

const Workpage = () => {

  const containerRef = useRef(null);
  useGSAP(() => {
   
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=175%",
        pin: true,
        scrub: 1,
      }
    });

   
    tl.to(".movingone", { xPercent: 115 }, "sync")
      .to(".movingtwo", { xPercent: -115 }, "sync")
      .to(".workbackground", { 
      scale: 4,      
      duration: 1,
      ease: "power2.inOut" 
    }, "sync");

  }, { scope: containerRef }); // Scoping prevents selecting elements outside this div
 

  return (
    <div className='h-screen w-[full] bg-[#0b0b0f] text-white flex flex-col justify-around relative ' ref={containerRef}>
      <div className="workpagefirst  w-full h-[10%] flex justify-center items-end">
        <p className='text-center'>Full-Stack Engineering</p>
      </div>

      <div className="workpagesecond  h-[75%] flex items-center justify-between px-35">
        <div className="movingone w-[25%] h-[35%]  flex justify-center items-center z-50">
          <p className='text-8xl'>Play</p>
        </div>
        <div className="movingtwo w-[25%] h-[35%]  flex justify-center items-center z-50">
          <p  className='text-8xl'>Work</p>
        </div>
      </div>


      <div className="workpagethird  w-full h-[15%] flex justify-center items-center">
        <p className='text-center'>Merging robust MERN backend architecture with<br/> high-performance, animated frontend interfaces.</p>
      </div>

      <div className="workbackground absolute inset-0 m-auto h-[25%] w-[25%] z-20">
        <img src={man} className='object-cover h-full w-full' />
      </div>
        
    </div>
  )
}

export default Workpage