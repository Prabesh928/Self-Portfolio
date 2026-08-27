import React, { useRef } from 'react'
import ReactPlayer from 'react-player';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import long from '../assets/long.jpg'
import typingfirst from '../assets/typing.mp4'
import typingsecond from '../assets/typingtwo.mp4'
import office from '../assets/office.jpg'
import contact from '../assets/contact.jpg'
gsap.registerPlugin(ScrollTrigger);

const Works = () => {

  const worksRef = useRef(null);

  useGSAP(()=>{
const tl = gsap.timeline({
  scrollTrigger:{
    trigger:worksRef.current,
    start: "-600px top",
    end:"bottom-=300 top",
    scrub:1,
    
  }
});

tl.to(".movingfirst",{ xPercent:-45},"sync")
  .to(".movingsecond",{xPercent:60},"sync")


  gsap.to(".moving3", {
      yPercent: -20,
      scrollTrigger: {
        trigger: ".moving3",  
        start: "top 85%",    
        end: "top 10%",       
        scrub: 1
        
      }
    });
  

  },{scope:worksRef})



 

  return (
    <div className='bg-blue-300  w-screen h-[215vh] py-40' >
      <div className="workshows bg-gray-500  h-[215vh] w-full relative flex flex-col gap-12  " ref={worksRef}>
        <div className='first bg-red-300  w-full h-[24%] mt-15 flex   '>
          <div className="movingfirst  h-[60%] w-[28%] ml-50 mt-35 z-50">
            <video 
    src={typingfirst}
   autoPlay 
  loop 
  muted 
  playsInline 
  className="w-full h-full object-cover"
  />
          </div>
          <div className="movingsecond  h-[70%] w-[13%] ml-50  z-50">
            <img src={contact} className='object-cover h-full w-full' />
          </div>
        </div>
        <div className="second bg-yellow-300  w-full h-[30%] mt-15 flex">
          <div className="movingfirst  h-[60%] w-[28%] ml-50 mt-10 z-50">
            <img src={office} className='object-cover h-full w-full' />
          </div>
          <div className="movingsecond  h-[90%] w-[28%] ml-50 mt-10  z-50">
            <video 
    src={typingsecond} 
    autoPlay 
  loop 
  muted 
  playsInline 
  className="w-full h-full object-cover" 
  />
          </div>
        </div>
        <div className="centerone bg-red-500 h-[42%] w-[25%]  z-20 absolute m-auto left-[35%]">
          <img src={long} className='object-cover h-full w-full' />
        </div>


      <div className="moving3 h-[40%] w-[48%] bg-white absolute left-[25%] bottom-0 flex flex-col items-center justify-center p-6 text-center shadow-lg ">
  
  {/* Small Top Tag */}
  <div className="flex items-center gap-1.5 text-xs text-neutral-500 tracking-wide mb-3">
    <span>✦</span>
    <span>Selected Works</span>
  </div>

  {/* Main Huge Heading */}
  <h2 className="text-8xl xl:text-8xl font-semibold tracking-tight text-neutral-900 leading-tight mb-4">
    Featured <br /> Projects
  </h2>

  {/* Subtext Paragraph */}
  <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mb-6 leading-relaxed">
   Explore a collection of high-performance web applications, responsive interfaces, and full-stack solutions.
  </p>

  {/* Bottom Link */}
  <a 
    href="#news" 
    className="inline-flex items-center gap-2 text-xs tracking-wider text-neutral-900 hover:opacity-70 transition-opacity"
  >
    <span className="text-[10px]">○</span> 
    <span className="border-b border-neutral-900 pb-0.5">Browse all news</span>
  </a>

</div>
      </div>
      

      
    </div>
  )
}

export default Works