import React from 'react'
import { useParams } from "react-router-dom";
import { projects } from "../assets/projectdata";

const Projectdetails = () => {

      const { id } = useParams();
       const project = projects.find(
    (project) => project.id === Number(id)
  );

  

  return (
    <div className='text-9xl text-black'>
        Projectdetails {id}
          {project.title}
        
        </div>
  )
}

export default Projectdetails