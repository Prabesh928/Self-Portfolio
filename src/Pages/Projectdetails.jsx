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
        markers:true,
     
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
      markers: true,
    }
  });

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

  <div className="projectgrid relative h-[120vh] w-screen overflow-hidden bg-[#f5f5f3]">

  {/* IMAGE 1 - LEFT */}
  <div className="img1 absolute left-[175px] top-[207px] h-[350px] w-[366px] overflow-hidden">
    <img
      src={projects[0].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 2 - TOP CENTER */}
  <div className="img2 absolute left-[574px] top-[54px] h-[261px] w-[600px] overflow-hidden">
    <img
      src={projects[1].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 3 - CENTER */}
  <div className="img3 absolute left-[578px] top-[337px] h-[220px] w-[502px] overflow-hidden">
    <img
      src={projects[2].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 4 - RIGHT */}
  <div className="img4 absolute left-[1114px] top-[337px] h-[220px] w-[505px] overflow-hidden">
    <img
      src={projects[3].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 5 - BOTTOM LEFT */}
  <div className="img5 absolute left-[59px] top-[578px] h-[260px] w-[603px] overflow-hidden">
    <img
      src={projects[4].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 6 - BOTTOM CENTER */}
  <div className="img6 absolute left-[694px] top-[578px] h-[260px] w-[386px] overflow-hidden">
    <img
      src={projects[5].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 7 - BOTTOM RIGHT */}
  <div className="img7 absolute left-[1113px] top-[578px] h-[247px] w-[406px] overflow-hidden">
    <img
      src={projects[0].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* MENU */}
  <div className="absolute right-[35px] top-[68px] text-[20px] text-black">
    Menu
  </div>

</div>

        
        
        </div>
  )
}

export default Projectdetails