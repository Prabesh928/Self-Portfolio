import React from 'react'

const Dynamicnumbers = ({ activeIndex = 0 }) => {
  const numbers = ["01", "02", "03", "04", "05", "06"]

  return (
    <div className="first flex h-full w-[10%] flex-col items-center justify-between py-12 text-[#2A2A2A] select-none">
      {/* Top Section / Spacing */}
      <div className="w-full bg-yellow-300" />

      {/* Middle Indicator Section */}
      <div className="flex flex-col items-center gap-4">
        {/* Top Vertical Divider Line */}
        <div className="h-16 w-[1px] bg-neutral-400" />

        {/* Project Number List */}
        <div className="flex flex-col items-center gap-3 font-mono text-sm tracking-widest">
          {numbers.map((num, i) => (
            <span
              key={num}
              className={`cursor-pointer transition-all duration-300 ${
                i === activeIndex
                  ? "font-bold text-black text-base scale-110"
                  : "text-neutral-400 hover:text-black"
              }`}
            >
              {num}
            </span>
          ))}
        </div>

        {/* Bottom Vertical Divider Line */}
        <div className="h-16 w-[1px] bg-neutral-400" />
      </div>

      {/* Bottom Tagline */}
      <div className="text-center font-sans text-[10px] tracking-[0.25em] text-neutral-500 uppercase leading-relaxed">
        IDEAS<br />
        INTO<br />
        REALITY
      </div>
    </div>
  )
}

export default Dynamicnumbers