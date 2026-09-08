import React, { useEffect, useRef } from 'react'
import photo1 from '../assets/one.jpg'
import { gsap } from 'gsap'




const About = () => {


  
  const movingref = useRef(null);
useEffect(() => {
  gsap.to(movingref.current, {
    xPercent: -50,
    duration: 80,
    repeat: -1,
    ease: "none"
  });
}, []);



  return (
    <div className='h-[100vh] w-full  flex justify-center items-end overflow-hidden '>

     
      <div
  ref={movingref}
  className="absolute h-[25%] top-50 flex font-bold text-8xl items-center  w-max"
>
  <div className="flex">
    <h1>CREATIVE DEVELOPER</h1>
    <h1>•</h1>
    <h1>WEB EXPERIENCES</h1>
    <h1>•</h1>
    <h1>FULL STACK</h1>
    <h1>•</h1>
    <h1>3D EXPERIENCES</h1>
    <h1>•</h1>
    <h1>CREATIVE CODING</h1>
    <h1>•</h1>
    <h1>GSAP ANIMATIONS</h1>
    <h1>•</h1>
    <h1>THREE.JS</h1>
    <h1>•</h1>
    <h1>BUILDING IDEAS</h1>
  </div>

  <div className="flex">
    <h1>CREATIVE DEVELOPER</h1>
    <h1>•</h1>
    <h1>WEB EXPERIENCES</h1>
    <h1>•</h1>
    <h1>FULL STACK</h1>
    <h1>•</h1>
    <h1>3D EXPERIENCES</h1>
    <h1>•</h1>
    <h1>CREATIVE CODING</h1>
    <h1>•</h1>
    <h1>GSAP ANIMATIONS</h1>
    <h1>•</h1>
    <h1>THREE.JS</h1>
    <h1>•</h1>
    <h1>BUILDING IDEAS</h1>
  </div>
</div>

        <div className='h-[30%] w-[85%]  mb-12 flex justify-between text-[#0d0e13]'>
          <div className="first h-full w-[30%]  flex flex-col justify-between">
            <div className='w-full h-[20%] -400 text-sm '>
              I'm a self-taught developer who likes turning ideas into things people can actually click, scroll, and enjoy. This is <br/> — a bit about how I got here
            </div>
            <div className='w-full h-[35%]  '>
              <p className=' underline '>prabeshgyawali928@gmail.com</p>
            </div>
          </div>
          <div className="second h-full w-[25%]  flex flex-col justify-between">
            <div className='w-full h-[75%]  flex justify-center items-baseline-last '>
              <p>
                4+ years coding <br/>
               Unlimited projects built <br/>
               Toronto,Canada
              </p>
            </div>
            <div className='w-full h-[10%]   flex justify-center'>
              <p>See my work →</p>
            </div>
          </div>

          <div className=' absolute h-[85%] w-[27%] top-12 left-1/2 -translate-x-1/2 ml-20'>
          <img src={photo1} className='w-full h-full object-cover' />
           </div>
          
           
           

            
        </div>
        
        
    </div>
  )
}

export default About