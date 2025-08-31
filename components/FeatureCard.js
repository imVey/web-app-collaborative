import { useState } from "react";

export default function FeatureCard({ icon, title, description }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="glass-effect rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl cursor-pointer relative overflow-hidden gradient-border group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Effet de brillance au hover */}
      <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      </div>

      {/* Icône avec animation */}
      <div
        className={`text-5xl mb-4 transition-transform duration-300 ${
          isHovered ? "scale-110 rotate-12" : ""
        }`}
      >
        {icon}
      </div>

      {/* Titre */}
      <h3 className="text-xl font-bold mb-3 text-slate-200 group-hover:text-primary-400 transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
        {description}
      </p>

      {/* Indicateur de hover */}
      <div
        className={`absolute bottom-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-primary-500 transition-all duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      ></div>
    </div>
  );
}
