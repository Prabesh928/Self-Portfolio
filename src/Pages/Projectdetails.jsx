import React from 'react'
import { useParams } from "react-router-dom";
import { projects } from "../assets/projectdata";

const Projectdetails = () => {

      const { id } = useParams();
       const project = projects.find(
    (project) => project.id === Number(id)
  );
//acess like project.title like this
  

  return (
    <div className='text-9xl text-black'>
        
        
        </div>
  )
}

export default Projectdetails