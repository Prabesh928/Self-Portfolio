import React, { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

const Skilltext = () => {
  const containerRef = useRef(null);
  // Separate letters so each can fall and stack independently
  const letters = "SKILLS".split("");

  const startAnimation = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(".letter-item");
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // This tracks the "ground" height so letters stack on each other
    const floorMap = new Array(width).fill(0);
    
    // Physics settings
    const letterWidth = 50; // Width of the letter block
    const letterHeight = 60; // Height of the letter block
    const gap = 4; // Space between stacked letters

    gsap.killTweensOf(items);

    items.forEach((item, i) => {
      // 1. Calculate X Position: Cluster them near the center
      const bias = (Math.random() + Math.random()) / 2; 
      const xPos = (width / 2 - letterWidth) + (bias - 0.5) * 120;
      
      const xStart = Math.floor(xPos);
      const xEnd = Math.floor(xPos + letterWidth);

      // 2. Collision Check: Find the current pile height at this X
      let pileHeight = 0;
      for (let j = xStart; j < xEnd; j++) {
        if (j >= 0 && j < width) {
          pileHeight = Math.max(pileHeight, floorMap[j]);
        }
      }

      // 3. Set Target Y
      const endY = height - pileHeight - letterHeight - gap;
      const rotation = gsap.utils.random(-15, 15);

      // 4. Update the "Ground" for the next letter
      for (let j = xStart; j < xEnd; j++) {
        if (j >= 0 && j < width) {
          floorMap[j] = pileHeight + letterHeight + gap;
        }
      }

      // 5. GSAP Animation
      const tl = gsap.timeline({ delay: i * 0.15 });

      tl.fromTo(item,
        { 
          y: -150, 
          x: xPos, 
          opacity: 0, 
          rotation: 0 
        },
        {
          y: endY,
          opacity: 1,
          duration: 0.7,
          ease: "power2.in", // Accelerating fall
        }
      )
      .to(item, {
        rotation: rotation,
        x: xPos + (xPos < width / 2 ? -8 : 8), // Slide slightly on hit
        y: endY - 10, // Small bounce pop
        duration: 0.2,
        ease: "power1.out"
      })
      .to(item, {
        y: endY,
        duration: 0.4,
        ease: "bounce.out" // Settling bounce
      });
    });
  }, []);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  return (
    <div className="flex flex-col items-center justify-center bg-black min-h-[50vh] w-full py-20 overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full max-w-xl h-[300px] border-b border-white/5"
      >
        {letters.map((char, i) => (
          <span
            key={i}
            className="letter-item absolute text-white font-bold text-6xl select-none"
            style={{ 
              display: 'inline-block',
              lineHeight: '0.8',
              pointerEvents: 'none',
              willChange: 'transform'
            }}
          >
            {char}
          </span>
        ))}
      </div>
      
      <button 
        onClick={startAnimation}
        className="mt-12 px-8 py-2 border border-white/20 text-white/50 text-xs tracking-widest hover:text-white hover:border-white transition-all rounded-full"
      >
        RE-ANIMATE
      </button>
    </div>
  );
};

export default Skilltext;