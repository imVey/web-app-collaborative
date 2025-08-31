import { useState } from "react";

export default function TechBadge({ name, description }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    // Afficher les informations dans une alerte (peut être remplacé par un modal)
    alert(`${name}\n\n${description}`);
  };

  const getBadgeColor = (techName) => {
    switch (techName.toLowerCase()) {
      case "next.js":
        return "from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border-slate-600";
      case "socket.io":
        return "from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border-green-500";
      case "postgresql":
        return "from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border-blue-500";
      default:
        return "from-primary-500 to-secondary-500 hover:from-primary-400 hover:to-secondary-400 border-primary-400";
    }
  };

  const getTechIcon = (techName) => {
    switch (techName.toLowerCase()) {
      case "next.js":
        return "▲";
      case "socket.io":
        return "⚡";
      case "postgresql":
        return "🐘";
      default:
        return "🚀";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          px-6 py-3 rounded-full font-semibold text-white
          bg-gradient-to-r ${getBadgeColor(name)}
          border-2 transition-all duration-300 
          transform hover:scale-110 hover:-translate-y-1
          shadow-lg hover:shadow-2xl
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-transparent
          relative overflow-hidden group
        `}
      >
        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

        {/* Contenu du badge */}
        <div className="relative flex items-center gap-2">
          <span className="text-lg">{getTechIcon(name)}</span>
          <span className="font-bold">{name}</span>
        </div>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dark-800 text-white text-sm rounded-lg shadow-xl z-50 w-64 border border-primary-500/20">
          <div className="font-semibold text-primary-400 mb-1">{name}</div>
          <div className="text-slate-300 text-xs leading-relaxed">
            {description}
          </div>
          {/* Flèche du tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-dark-800"></div>
        </div>
      )}
    </div>
  );
}
