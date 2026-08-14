import React, { useRef, forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Typewriter from "typewriter-effect";
import { GiHamburgerMenu } from "react-icons/gi";
gsap.registerPlugin(ScrollTrigger);

const Navbar = forwardRef(({ landing, setmenuopen, menuopen }, ref) => {
  const navbarRef = useRef(null);
  const tlRef = useRef(null); // store timeline
  const navLinksRef = useRef(null);
  const menuRef = useRef(null);
  const typewriterRef = useRef(null);

  // Timeline animation for logo & links
  useEffect(() => {
    const ctx = gsap.context(() => {
      tlRef.current = gsap.timeline({ paused: true });

      // Animate logo
      tlRef.current.from(navbarRef.current.querySelector(".nav-item.logo"), {
        y: 50,
        opacity: 0,
        duration: 0.8,
      });

      // Animate nav links
      tlRef.current.from(
        navbarRef.current.querySelectorAll(".nav-item:not(.logo)"),
        {
          y: (i) => 50 + i * 10,
          opacity: 0,
          stagger: 0.08,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.4"
      );
    }, navbarRef);

    return () => ctx.revert(); // clean up timeline
  }, []);

  // Expose startAnimation function to parent
  useImperativeHandle(ref, () => ({
    startAnimation: () => {
      if (tlRef.current) tlRef.current.play();
    },
  }));

  // Typewriter logic
  const startPortfolioTyping = () => {
    if (!typewriterRef.current) return;
    typewriterRef.current.deleteAll().typeString("P o r t f o l i o").start();
  };

  useEffect(() => {
    window.startPortfolioTyping = startPortfolioTyping;
    return () => delete window.startPortfolioTyping;
  }, []);

  // ScrollTriggers for navbar visibility and nav links
  useEffect(() => {
    if (!landing?.current) return;

    const ctx = gsap.context(() => {
      // Navbar hide/show based on scroll
      ScrollTrigger.create({
        trigger: landing.current,
        start: "-500px top",
        end: "-250px top",
        ease: "back.out(1.7)",
        onToggle: (self) => {
          if (self.isActive) navbarRef.current.classList.add("opacity-0");
          else navbarRef.current.classList.remove("opacity-0");
        },
      });

      // Nav links hide/show, menu appear
      ScrollTrigger.create({
        trigger: landing.current,
        start: "-330px top",
        end: "bottom top",
        ease: "back.out(1.7)",
        scrub: true,
        onUpdate: (self) => {
          if (menuopen) return; // skip while menu open
          if (self.progress > 0.05) {
            navLinksRef.current?.classList.add("hidden");
            menuRef.current?.classList.remove("hidden");
            menuRef.current?.classList.add("flex");
          } else {
            navLinksRef.current?.classList.remove("hidden");
            menuRef.current?.classList.remove("flex");
            menuRef.current?.classList.add("hidden");
          }
        },
      });
    }, navbarRef);

    return () => ctx.revert(); // clean up ScrollTriggers
  }, [landing, menuopen]);

  // Force menu mode when menu is open
  useEffect(() => {
    if (menuopen) {
      navLinksRef.current?.classList.add("hidden");
      menuRef.current?.classList.remove("hidden");
      menuRef.current?.classList.add("flex");
      navbarRef.current?.classList.remove("opacity-0"); // ensure navbar visible
    }
  }, [menuopen]);

  const togglefunction = () => {
    setmenuopen((prev) => !prev);
  };

  return (
    <div
      ref={navbarRef}
      className={`${menuopen ? "text-black" : "text-gray-50"} fixed top-0 left-0 z-70 flex w-full h-[12vh] justify-between px-12 items-end bg-transparent`}
    >
      {/* LOGO */}
      <div className="navone w-[15%] h-[70%] text-3xl flex flex-col justify-center">
        <div className="relative text-center nav-item logo flex flex-col">
          <span className="font-heading font-extrabold tracking-wider">
            Pra <span className="font-fancy">&nbsp;Besh</span>
          </span>

          {/* TYPEWRITER TEXT */}
          <span className="font-fancy absolute text-lg -bottom-6 left-1/2 -translate-x-1/2">
            <Typewriter
              onInit={(typewriter) => {
                typewriterRef.current = typewriter;
              }}
              options={{
                autoStart: false,
                loop: false,
                delay: 150,
                deleteSpeed: 50,
                cursor: "",
              }}
            />
          </span>
        </div>
      </div>

      {/* NAV LINKS */}
      <div className="navtwo w-[25%] flex h-[70%]" ref={navLinksRef}>
        <ul className="flex w-full h-full justify-between items-center">
          <li className="nav-item">Home</li>
          <li className="nav-item">About</li>
          <li className="nav-item">Projects</li>
          <li className="nav-item">Skills</li>
          <li className="nav-item">Contact</li>
        </ul>
      </div>

      {/* MENU AFTER SCROLL */}
      <div
        ref={menuRef}
        className={`w-[25%] hidden justify-end items-center gap-2 h-[70%] ${
          menuopen ? "text-black" : "text-gray-50"
        }`}
      >
        <p>{menuopen ? "Close":"Menu"}</p>
        <GiHamburgerMenu
          className="text-xl hover:cursor-pointer transition-transform duration-300 ease-in-out hover:rotate-180"
          onClick={togglefunction}
        />
      </div>
    </div>
  );
});

export default Navbar;
