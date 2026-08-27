import React from 'react';

const Skillcard = ({ 
  title = "Full-Stack MERN Architecture", 
  subtitle = "Backend and Database engineering", 
  skills = [], 
  footer = [],
  className = "" 
}) => {
  return (
    <div className={`border border-black shadow-2xl h-[65vh] w-[22vw] rounded-xl bg-white ${className}`}>
      <div className="h-full w-full p-6 flex flex-col justify-between text-black">
        {/* Title */}
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm mt-2 opacity-80">{subtitle}</p> 
        </div>

        {/* Skills */}
        <div className="space-y-2">
          {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <div key={index} className="flex items-center">
                <IconComponent className={`${skill.color || ""} text-4xl`} />
                <p className="ml-3">{skill.name}</p>
              </div>
            );
          })}
        </div>

        {/* Footer / Extras */}
        <div className="text-xs opacity-70">
          {footer.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skillcard;