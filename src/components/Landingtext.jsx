import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const Landingtext = forwardRef((props, ref) => {
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!headingRef.current || !paraRef.current) return;

    const ctx = gsap.context(() => {
      const splitHeading = new SplitText(headingRef.current, { type: "chars,words" });
      const splitPara = new SplitText(paraRef.current, { type: "words" });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      tl.to(headingRef.current, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1 });

      tl.from(splitHeading.chars, { y: 50, opacity: 0, stagger: 0.08 }, "-=0.4");

      tl.to(
        paraRef.current,
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1, ease: "power2.out" },
        "-=0.3"
      );

      tl.from(
        splitPara.words,
        { y: 20, opacity: 0, stagger: 0.08, duration: 0.5, ease: "power2.out" },
        "-=0.5"
      );

      tlRef.current = tl;

      // Cleanup SplitText when component unmounts
      return () => {
        tl.kill();
        splitHeading.revert();
        splitPara.revert();
      };
    }, headingRef);

    return () => ctx.revert();
  }, []);

  // Expose timeline controls to parent
  useImperativeHandle(ref, () => ({
    play: () => tlRef.current?.play(),
    pause: () => tlRef.current?.pause(),
    restart: () => tlRef.current?.restart(),
  }));

  return (
    <div className="text-white h-[30vh] w-[50vw] flex flex-col justify-around">
      <h1
        ref={headingRef}
        className="text-6xl tracking-widest"
        style={{
          clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
          overflow: "hidden",
        }}
      >
        MERN Stack Developer
      </h1>

      <p
        ref={paraRef}
        className="text-lg tracking-widest"
        style={{
          clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
          overflow: "hidden",
        }}
      >
        Specializing in building full-stack web applications using the MERN stack, focused on performance, scalability, and maintainable code for real-world production environments.
      </p>
    </div>
  );
});

export default Landingtext;
