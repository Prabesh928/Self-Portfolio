import React from 'react'

import Workcard from '../components/Workcard'
import Work1 from '../assets/work1.webp'

const data1 = "Work Title";


const Project = () => {

  return (
    <div className=' h-[100vh] w-[100vw] bg-black'>
<Workcard tittle={data1} imgpath={Work1} />
     
        
        
    </div>
  )
}

export default Project