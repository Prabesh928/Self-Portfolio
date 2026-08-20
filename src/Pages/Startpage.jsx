import React from "react";

function Startpage({ onStart }) {
  return (
    <div 
      onClick={onStart}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center  bg-black text-white cursor-pointer select-none"
    >
      <h1 className="text-3xl font-heading md:text-5xl font-bold tracking-widest hover:scale-105 transition-transform duration-300">
        CLICK HERE TO ENTER
      </h1>
      <p className="text-gray-400 mt-4 text-sm tracking-wide">
        🔊 Sound & Interactive Experience
      </p>
    </div>
  );
}

export default Startpage;