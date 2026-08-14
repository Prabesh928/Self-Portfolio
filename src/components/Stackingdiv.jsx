import React, { useRef } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lottie from "lottie-react";
import runningman from "../assets/cyclewalk.json";
import Nodejs from '../assets/Nodejs.json'
import reactlogo from '../assets/reactlogo.json'
import JavaScript from '../assets/JavaScript.json'
import { SiMongodb } from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaCss3Alt } from "react-icons/fa";
import { FaHtml5 } from "react-icons/fa6";
import { TbBrandThreejs } from "react-icons/tb";
import { TbBrandFramerMotion } from "react-icons/tb";

const Stackingdiv = () => {

      const secondcontainer =useRef(null);
      const lottieRef = useRef();
      
     useGSAP(()=>{
    
      const tl = gsap.timeline({
  scrollTrigger: {
   
    trigger: secondcontainer.current,
    
    pin: true,
    scrub: 1,
    start: "+=185 15%",
    end: "+=900",
    
  }
});



// Card 2 slides up and stops at 10% (leaving 10% of Card 1 visible at the top)
tl.fromTo(".stacking-second", 
  { yPercent: 100, opacity: 0,scale:0.3 }, 
  { yPercent: 20, opacity: 1, duration: 1,scale:1 }
)

// Card 3 slides up and stops at 20% (leaving the edges of Card 1 and 2 visible)
.fromTo(".stacking-third", 
  { yPercent: 100, opacity: 0,scale:0.3 }, 
  { yPercent: 27, opacity: 1, duration: 1, scale:1 }
);

      },{scope:secondcontainer})



useGSAP(() => {

  let lastX = -window.innerWidth; // initial position

  gsap.fromTo(
    ".lottie-class",
    { x: -window.innerWidth, scaleX: 1 }, // scaleX=1 is facing right
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
          
          // Check scroll direction
          if (currentX > lastX) {
            // Scrolling down → man faces right
            gsap.to(".lottie-class", { scaleX: 1, duration: 0.1 });
          } else {
            // Scrolling up → man faces left
            gsap.to(".lottie-class", { scaleX: -1, duration: 0.1 });
          }

          lastX = currentX;

          // Play/pause Lottie
          if (Math.abs(self.getVelocity()) > 5) {
            lottieRef.current?.play();
          } else {
            lottieRef.current?.pause();
          }
        },

        onLeave: () => lottieRef.current?.pause(),
        onLeaveBack: () => lottieRef.current?.pause(),
      }
    }
  );

}, { scope: secondcontainer });


    
  return (
      <div className=" h-[110vh]  w-full relative flex justify-center items-center  " ref={secondcontainer}>

        <div className="foricons absolute top-5 w-full h-[10%]  flex justify-center items-center gap-25 ">
          <div className='firsticon w-[5%] h-full   '>
            <Lottie animationData={JavaScript} autoplay={true} />
          </div>
          <div className='secondicon w-[5%] h-full  '>
             <Lottie animationData={Nodejs}  autoplay={true} />
          </div>
          <div className='thirdicon w-[5%] h-full  '>
             <Lottie  animationData={reactlogo}  autoplay={true}/>
          </div>

          <div className='thirdicon w-[5%] h-full  flex justify-center items-center '>
             <SiMongodb  className='w-[60%] h-[60%]' />
          </div>

          <div className='thirdicon w-[5%] h-full  flex justify-center items-center '>
             <RiTailwindCssFill className='w-[60%] h-[60%]'  />
          </div>

          <div className='thirdicon w-[5%] h-full  flex justify-center items-center '>
            <FaCss3Alt  className='w-[60%] h-[60%]' />
          </div>

          <div className='thirdicon w-[5%] h-full  flex justify-center items-center '>
             <TbBrandThreejs  className='w-[60%] h-[60%]' />
          </div>

           <div className='thirdicon w-[5%] h-full  flex justify-center items-center '>
             <TbBrandFramerMotion  className='w-[60%] h-[60%]' />
          </div>
        </div>




{/* lottie animation  */}
        <div className='absolute bottom-2   h-20  w-20  lottie-class'>
            <Lottie
       lottieRef={lottieRef}
        animationData={runningman}
        autoplay={false}
        style={{ width: "120px", height: "120px", zIndex:"50"}}
        
      />

        </div>



            <div className="border border-black shadow-2xl h-[65vh] w-[27vw] absolute top-50  stacking-first z-10 rounded-xl">
                <div className="h-full w-full p-6 flex flex-col justify-between text-black">
    
    {/* Title */}
    <div>
      <h2 className="text-2xl font-bold tracking-wide">
        MERN Stack Developer
      </h2>
      <p className="text-sm mt-2 opacity-80">
        Full-stack JavaScript development
      </p>
    </div>

    {/* Skills */}
    <div className="space-y-2 text-sm font-medium">
      <p>⚡ MongoDB</p>
      <p>⚡ Express.js</p>
      <p>⚡ React.js</p>
      <p>⚡ Node.js</p>
      <p>⚡ REST APIs</p>
      <p>⚡ Authentication (JWT, Bcrypt)</p>
    </div>

    {/* Footer / Extras */}
    <div className="text-xs opacity-70">
      <p>✔ Clean Architecture</p>
      <p>✔ Scalable Backend</p>
      <p>✔ Modern UI Animations</p>
    </div>

  </div>
            </div>
             <div className="border border-black shadow-2xl h-[65vh] w-[27vw] absolute left-20 top-30  stacking-second rounded-xl z-20">second</div>
              <div className="border border-black shadow-2xl h-[65vh] w-[27vw]  absolute right-20 top-23  stacking-third rounded-xl z-30">third</div>
        </div>
  )
}

export default Stackingdiv