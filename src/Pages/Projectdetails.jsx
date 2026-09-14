import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { projects } from "../assets/projectdata";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Projectdetails = () => {

      const { id } = useParams();
      const project = projects.find(
    (project) => project.id === Number(id)
  );


 const container = useRef(null);
 const sectionRef = useRef(null);

  useGSAP(() => {

    // BACK moves slowly
    gsap.to(".back", {
      y: -150,

      scrollTrigger: {
        trigger: ".back",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
       
     
      }
    });


    

    
    gsap.to(".front", {
      y: -800,

      scrollTrigger: {
        trigger: ".front",
        start: "top-=300 top",
        end: "bottom top",
        scrub: true,
        
        
      }
    });

  }, {
    scope: container
  });

  

useGSAP(() => {

  gsap.to(".white", {
    yPercent: -50,

    scrollTrigger: {
      trigger: ".white",
      start: "top bottom",
      end: "top top",
      scrub: true,
     
    }
  });


  gsap.set(".img3", {
  left: "50%",
  top: "50%",
  xPercent: -50,
  yPercent: -50
});

gsap.to(".img3", {
 width: "screen",
height: "screen",
left: "50%",
top: "50%",
xPercent: -50,
yPercent: -50,
  scrollTrigger: {
    trigger: ".projectgrid",
    start: "top top",
    end: "+=1400",
    scrub: true,
    pin: true,
    markers:true,
     anticipatePin: 1,
  fastScrollEnd: true,
  invalidateOnRefresh: true,
  }
});

gsap.to(".commonimg", {
  scale: 3,
  scrollTrigger: {
    trigger: ".projectgrid",
    start: "top top",
    end: "+=1400",
    scrub: true,
  }
});

gsap.to(".img1", { x: -4500, y: -150, scrollTrigger: { trigger: ".projectgrid", start: "top top", end: "+=1300", scrub: true }});
gsap.to(".img2", { y: -2000, scrollTrigger: { trigger: ".projectgrid", start: "top top", end: "+=1300", scrub: true }});
gsap.to(".img4", { x: 4500, scrollTrigger: { trigger: ".projectgrid", start: "top top", end: "+=1300", scrub: true }});
gsap.to(".img5", { x: -3500, y: 2200, scrollTrigger: { trigger: ".projectgrid", start: "top top", end: "+=1300", scrub: true }});
gsap.to(".img6", { y: 1900, scrollTrigger: { trigger: ".projectgrid", start: "top top", end: "+=1300", scrub: true }});
gsap.to(".img7", { x: 5500, y: 2200, scrollTrigger: { trigger: ".projectgrid", start: "top top", end: "+=1300", scrub: true }});


  

}, { scope: sectionRef });
 



  

  return (
    <div ref={sectionRef} className='div text-black '>

      <div ref={container} 
      style={{
    backgroundImage: `url(${project.image})`,
  }}
      className='bg-cover bg-center back relative h-[200vh] w-full  flex justify-center items-end'>
        {/* <img src={project.image} className='object-cover'/> */}

        <div className='front z-0  h-[60%] w-[75%] bg-yellow-800 flex justify-center '>

          <div className="first h-full w-[50%]">2</div>
          <div className="second h-full w-[50%]">3</div>
        </div>
      </div>

      <div  className='z-80 white bg-white h-[150vh] w-full '>
        
        <div className='h-full bg-white'> okey </div>
        
        
      </div>

  <div className="projectgrid  relative h-screen w-screen overflow-hidden bg-[#f5f5f3]">

  {/* IMAGE 1 - LEFT */}
  <div className="commonimg img1 absolute left-[13.5%] top-[24%] h-[40%] w-[20.5%] overflow-hidden">
    <img
      src={projects[0].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 2 - TOP CENTER */}
  <div className="commonimg img2 absolute left-[36%] top-[5%] h-[30%] w-[34%] overflow-hidden">
    <img
      src={projects[1].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 3 - CENTER */}
  <div 
   style={{ minHeight: "25%", minWidth: "28.5%" }}
  className="img3 -z-1 commonimg  absolute left-[34%] top-[39%]  overflow-hidden">
    <img
      src={projects[2].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 4 - RIGHT */}
  <div className="commonimg img4 absolute left-[65.5%] top-[37.5%] h-[25%] w-[28%] overflow-hidden">
    <img
      src={projects[3].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 5 - BOTTOM LEFT */}
  <div className="commonimg img5 absolute left-[7.5%] top-[67%] h-[28%] w-[33%] overflow-hidden">
    <img
      src={projects[4].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 6 - BOTTOM CENTER */}
  <div className="commonimg img6 absolute left-[42%] top-[67%] h-[28%] w-[22%] overflow-hidden">
    <img
      src={projects[5].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 7 - BOTTOM RIGHT */}
  <div className="img7 commonimg absolute left-[65.5%] top-[67%] h-[28%] w-[23%] overflow-hidden">
    <img
      src={projects[0].image}
      className="h-full w-full object-cover"
    />
  </div>




</div>



        
        
        </div>
  )
}

export default Projectdetails