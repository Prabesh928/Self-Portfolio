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

  },{scope:worksRef})

  return (
    <div className='bg-white  w-screen h-[250vh] py-40' >
      <div className="workshows  h-[145vh] w-full relative flex flex-col gap-12  " ref={worksRef}>
        <div className='first  w-full h-[35%] mt-15 flex   '>
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
        <div className="second  w-full h-[45%] mt-15 flex">
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
        <div className="centerone h-[62%] w-[25%]  z-20 absolute m-auto left-[35%]">
          <img src={long} className='object-cover h-full w-full' />
        </div>
      </div>
    </div>
  )
}

export default Works