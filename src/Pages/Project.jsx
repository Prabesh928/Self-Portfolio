import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Workcard from "../components/Workcard";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Work1 from "../assets/work1.webp";
import Work2 from "../assets/contact.jpg";

const data1 = "Work Title";
const data2 = "Web Socket web game";

gsap.registerPlugin(ScrollTrigger);

const Project = () => {
  const container = useRef(null);

  const work1Ref = useRef(null);
  const work2Ref = useRef(null);

  return (
    <div
      ref={container}
      className="relative h-[200vh] w-full bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Work 1 */}
        <div
          ref={work1Ref}
          className="absolute inset-0"
        >
          <Workcard
            tittle={data1}
            imgpath={Work1}
          />
        </div>

        {/* Work 2 */}
        <div
          ref={work2Ref}
          className="absolute inset-0 opacity-0"
        >
          <Workcard
            tittle={data2}
            imgpath={Work2}
          />
        </div>

      </div>
    </div>
  );
};

export default Project;