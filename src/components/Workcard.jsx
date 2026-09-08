import React from 'react'


const Workcard = ({tittle, imgpath}) => {
  return (
          <div className=' h-[100vh] w-[100vw] relative'>

           
       <img src={imgpath} className='h-full w-full object-cover' />
       <div className='h-[57%] w-[50%] absolute left-[40%] top-1/2 -translate-x-1/2 -translate-y-1/2  flex justify-around items-center '> 
       <div className="text h-full w-[40%] ">
        <div className='text-white flex flex-col justify-center h-full w-full'>
          <h1 className='text-5xl'>{tittle}</h1>
          <p>Feature all projects.</p>
        </div>
       </div>
       <div className="subimg h-full w-[40%] ">
         <img src={imgpath} className='h-full w-full object-cover' />
       </div>
        </div>

      </div>
  )
}

export default Workcard