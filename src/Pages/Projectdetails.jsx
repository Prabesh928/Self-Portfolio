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

  <div className="projectgrid relative h-screen w-screen overflow-hidden bg-[#f5f5f3]">

  {/* IMAGE 1 - LEFT */}
  <div className="img1 absolute left-[10.5%] top-[24%] h-[40%] w-[21.5%] overflow-hidden">
    <img
      src={projects[0].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 2 - TOP CENTER */}
  <div className="img2 absolute left-[34%] top-[6%] h-[30%] w-[35%] overflow-hidden">
    <img
      src={projects[1].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 3 - CENTER */}
  <div className="img3 absolute left-[34%] top-[39%] h-[25%] w-[29.5%] overflow-hidden">
    <img
      src={projects[2].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 4 - RIGHT */}
  <div className="img4 absolute left-[66%] top-[39%] h-[25%] w-[30%] overflow-hidden">
    <img
      src={projects[3].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 5 - BOTTOM LEFT */}
  <div className="img5 absolute left-[3.5%] top-[67%] h-[28%] w-[35%] overflow-hidden">
    <img
      src={projects[4].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 6 - BOTTOM CENTER */}
  <div className="img6 absolute left-[41%] top-[67%] h-[28%] w-[23%] overflow-hidden">
    <img
      src={projects[5].image}
      className="h-full w-full object-cover"
    />
  </div>


  {/* IMAGE 7 - BOTTOM RIGHT */}
  <div className="img7 absolute left-[66%] top-[67%] h-[28%] w-[24%] overflow-hidden">
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