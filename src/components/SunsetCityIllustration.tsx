import React from 'react';

export const SunsetCityIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 1200 675"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky Gradient: Navy night -> Twilight violet -> Golden sunset horizon */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#121838" />
            <stop offset="35%" stopColor="#25245a" />
            <stop offset="60%" stopColor="#5d3568" />
            <stop offset="78%" stopColor="#b44b61" />
            <stop offset="92%" stopColor="#f58e58" />
            <stop offset="100%" stopColor="#fed285" />
          </linearGradient>

          {/* Golden city haze glow */}
          <radialGradient id="sunGlow" cx="50%" cy="85%" r="60%">
            <stop offset="0%" stopColor="#ffd875" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#25245a" stopOpacity="0" />
          </radialGradient>

          {/* Building silhouette gradients */}
          <linearGradient id="bldgGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#803859" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3d1b38" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="bldgGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4f203f" />
            <stop offset="100%" stopColor="#1b0e24" />
          </linearGradient>
          <linearGradient id="bldgGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c142b" />
            <stop offset="100%" stopColor="#0c0712" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="1200" height="675" fill="url(#skyGrad)" />
        <rect width="1200" height="675" fill="url(#sunGlow)" />

        {/* Delicate Twinkling Stars */}
        <g fill="#ffffff" opacity="0.75">
          <circle cx="180" cy="80" r="1.5" />
          <circle cx="290" cy="50" r="2" />
          <circle cx="340" cy="110" r="1.2" />
          <circle cx="480" cy="70" r="1.8" />
          <circle cx="600" cy="40" r="2.2" />
          <circle cx="720" cy="95" r="1.4" />
          <circle cx="850" cy="60" r="2" />
          <circle cx="980" cy="115" r="1.3" />
          <circle cx="1060" cy="75" r="1.7" />
          <circle cx="1120" cy="130" r="1" />
          <circle cx="220" cy="160" r="1" />
          <circle cx="560" cy="140" r="1.5" />
          <circle cx="890" cy="150" r="1.2" />
        </g>

        {/* Distant Layer of City Buildings (Soft Purple-Red Haze) */}
        <g fill="url(#bldgGrad1)" opacity="0.6">
          <rect x="60" y="380" width="45" height="180" />
          <polygon points="60,380 82,340 105,380" />
          <rect x="130" y="360" width="70" height="200" />
          <rect x="230" y="390" width="55" height="170" />
          <rect x="310" y="340" width="85" height="220" />
          <polygon points="310,340 352,300 395,340" />
          <rect x="420" y="370" width="60" height="190" />
          <rect x="500" y="330" width="90" height="230" />
          <rect x="610" y="380" width="50" height="180" />
          <rect x="680" y="350" width="80" height="210" />
          <polygon points="720,350 720,280 725,350" />
          <rect x="790" y="390" width="70" height="170" />
          <rect x="880" y="330" width="95" height="230" />
          <rect x="1000" y="360" width="65" height="200" />
          <polygon points="1000,360 1032,320 1065,360" />
          <rect x="1080" y="380" width="60" height="180" />
        </g>

        {/* Mid-ground Layer of City Buildings */}
        <g fill="url(#bldgGrad2)" opacity="0.85">
          <rect x="20" y="410" width="90" height="200" />
          <rect x="140" y="380" width="80" height="230" />
          <polygon points="180,380 180,310 182,380" />
          <rect x="250" y="420" width="70" height="190" />
          <rect x="340" y="370" width="110" height="240" />
          <rect x="470" y="410" width="75" height="200" />
          <rect x="565" y="350" width="95" height="260" />
          <polygon points="612,350 612,270 614,350" />
          <rect x="680" y="400" width="85" height="210" />
          <rect x="785" y="360" width="105" height="250" />
          <rect x="910" y="410" width="75" height="200" />
          <rect x="1005" y="380" width="90" height="230" />
          <polygon points="1050,380 1050,320 1052,380" />
          <rect x="1110" y="430" width="70" height="180" />
        </g>

        {/* Glowing Yellow/Orange Windows on mid-ground buildings */}
        <g fill="#fef08a" opacity="0.55">
          <circle cx="160" cy="420" r="2" />
          <circle cx="180" cy="420" r="2" />
          <circle cx="160" cy="450" r="2" />
          <circle cx="180" cy="450" r="2" />
          <circle cx="365" cy="410" r="2" />
          <circle cx="395" cy="410" r="2" />
          <circle cx="365" cy="440" r="2" />
          <circle cx="395" cy="440" r="2" />
          <circle cx="590" cy="390" r="2" />
          <circle cx="615" cy="390" r="2" />
          <circle cx="590" cy="420" r="2" />
          <circle cx="615" cy="420" r="2" />
          <circle cx="810" cy="400" r="2" />
          <circle cx="835" cy="400" r="2" />
          <circle cx="810" cy="430" r="2" />
          <circle cx="835" cy="430" r="2" />
          <circle cx="1030" cy="410" r="2" />
          <circle cx="1050" cy="410" r="2" />
        </g>

        {/* Foreground Rooftop / Observation Deck Horizon */}
        <path
          d="M0 550 Q 600 535 1200 550 L1200 675 L0 675 Z"
          fill="url(#bldgGrad3)"
        />

        {/* High School Students Silhouette in Foreground */}
        {/* Left student (boy with backpack, looking right towards city) */}
        <g fill="#08040d">
          {/* Head & hair */}
          <path d="M 285 490 Q 285 450 315 450 Q 345 450 345 490 Q 335 505 320 505 Q 295 505 285 490 Z" />
          {/* Hair strands */}
          <path d="M 280 475 Q 310 440 340 455 Q 350 480 345 500 Q 320 460 280 475 Z" />
          {/* Neck */}
          <rect x="305" y="495" width="20" height="20" />
          {/* Shoulders & Jacket */}
          <path d="M 245 570 Q 260 515 315 515 Q 370 515 385 570 L 400 675 L 230 675 Z" />
          {/* Backpack strap silhouette */}
          <path d="M 280 525 Q 295 580 300 640" stroke="#1c1124" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Right student (standing closer, side-profile with ponytail / jacket, looking forward) */}
        <g fill="#08040d">
          {/* Head & hair with anime fringe */}
          <path d="M 850 480 Q 860 435 895 435 Q 930 435 935 480 Q 925 505 900 505 Q 865 505 850 480 Z" />
          {/* Ponytail / hair wind motion */}
          <path d="M 925 455 Q 960 465 965 490 Q 945 495 925 475 Z" />
          {/* Neck */}
          <rect x="885" y="495" width="18" height="20" />
          {/* Torso & Uniform collar */}
          <path d="M 825 565 Q 845 515 895 515 Q 945 515 970 565 L 985 675 L 805 675 Z" />
          {/* Backpack */}
          <path d="M 945 540 Q 980 560 970 630 L 945 625 Z" />
        </g>
      </svg>
    </div>
  );
};
