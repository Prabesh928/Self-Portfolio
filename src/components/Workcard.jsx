import React from "react";

const Workcard = ({ tittle, description, imgpath, className }) => {
  return (
    <div
      className={`relative h-screen w-screen overflow-hidden ${
        className || ""
      }`}
    >
      <img
        src={imgpath}
        className="bigimg absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute left-1/2 top-1/2 h-[57%] w-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-around items-center">

        {/* Text */}
        <div className="text h-full w-[40%]">
          <div className="text-white flex flex-col justify-center h-full w-full">
            <h1 className="text-5xl">{tittle}</h1>
            <p>{description}</p>
          </div>
        </div>

        {/* Small Image */}
        <div className="subimg h-full w-[40%] overflow-hidden">
          <img
            src={imgpath}
            className="smallimg h-full w-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default Workcard;