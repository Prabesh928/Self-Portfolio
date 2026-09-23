import React from 'react'

const Projectdetails = () => {
  return (
       <div className="third flex h-full w-[35%] flex-col justify-between py-16 pr-12 pl-6 text-[#1A1A1A] select-none">
  {/* Top Section Header */}
  <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.2em] text-neutral-500 uppercase">
    <span>Selected Work</span>
    <div className="h-[1px] flex-1 bg-neutral-300 mx-4" />
    <span className="font-mono text-black">01 / 06</span>
  </div>

  {/* Main Content Area */}
  <div className="flex flex-col gap-6 my-auto">
    {/* Title & Subtitle */}
    <div>
      <h2 className="text-4xl font-extrabold tracking-tight uppercase leading-[1.05] text-[#0F172A]">
        Solar Wind<br />Prediction
      </h2>
      <p className="mt-2 text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase">
        AI / Machine Learning
      </p>
    </div>

    {/* Project Description */}
    <p className="text-sm leading-relaxed text-neutral-600 font-normal max-w-md">
      A machine learning project to forecast solar wind parameters using time-series data. Built for the Benchlab competition with a focus on reproducibility and real-world deployment.
    </p>

    {/* Action Buttons */}
    <div className="flex items-center gap-4 pt-2">
      <a
        href="#"
        className="flex items-center gap-2 rounded-full bg-[#0F172A] px-6 py-3 text-xs font-medium text-white transition-transform hover:scale-105 active:scale-95"
      >
        <span>View Project</span>
        <span>&rarr;</span>
      </a>

      <a
        href="#"
        className="flex items-center gap-2 rounded-full px-4 py-3 text-xs font-semibold text-neutral-700 hover:text-black transition-colors"
      >
        <span>Live Demo</span>
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>

    {/* Tech Stack Pills */}
    <div className="flex flex-wrap gap-2 pt-2">
      {["Python", "Machine Learning", "Time Series", "Docker"].map((tech) => (
        <span
          key={tech}
          className="rounded-full border border-neutral-300 bg-white/50 px-3.5 py-1.5 text-[11px] font-medium text-neutral-700 backdrop-blur-sm"
        >
          {tech}
        </span>
      ))}
    </div>
  </div>

  {/* Bottom Scroll Indicator */}
  <div className="flex items-center gap-3 pt-4 text-neutral-400">
    <svg className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
    <span className="text-[10px] font-medium tracking-[0.2em] uppercase">Scroll to explore</span>
  </div>
</div>
  )
}

export default Projectdetails