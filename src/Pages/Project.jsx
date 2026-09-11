import React , { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Workcard from '../components/Workcard'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Work1 from '../assets/work1.webp'
import Work2 from '../assets/contact.jpg'
const data1 = "Work Title";
const data2 = "Web Socket web game"

gsap.registerPlugin(ScrollTrigger);

const Project = () => {
  const container = useRef(null);
useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: true,
      }
    });

    // 1. First, animate the inner child elements while the card is pinned
    tl.to('.first-div .smallimg', {
        scale: 0.85,
        opacity: 0.3,
        ease: 'none',
        pin:true,
      })

      // 2. Then, slide the parent card away afterward
      .to('.first-div', {
        y: '-100%',
        ease: 'none'
      });

  }, { scope: container });

  return (
    <div ref={container} className=' h-[100vh] w-[100vw] bg-black'>
<Workcard tittle={data1} imgpath={Work1} className ="first-div absolute inset-0 z-30" />
<Workcard tittle={data2} imgpath={Work2} className =" inset-0 absolute z-20 " />
     
        
        
    </div>
  )
}

export default Project