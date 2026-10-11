import React from 'react';

/**
 * High-fidelity anime illustration matching "Hoàng hôn thành phố dưới cánh hoa đào":
 * - Twilight sunset sky with glowing sun horizon and comets/shooting stars
 * - Cherry blossom branches (hoa đào) with drifting pink petals on top-left
 * - Autumn maple foliage (lá phong cam đỏ) on top-right
 * - Sunset metropolis reflection on the river
 * - High school students on terrace overlooking the sunset city on left and right
 */
export const SunsetCityIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 1440 810"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky Gradient: Deep twilight blue -> Lavender pink -> Radiant orange sunset -> Golden sun */}
          <linearGradient id="twilightSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="28%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#9333ea" stopOpacity="0.85" />
            <stop offset="68%" stopColor="#f43f5e" />
            <stop offset="82%" stopColor="#fb923c" />
            <stop offset="93%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          {/* Golden sun burst at horizon */}
          <radialGradient id="sunBurst" cx="50%" cy="72%" r="45%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="20%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#f97316" stopOpacity="0.65" />
            <stop offset="80%" stopColor="#be123c" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
          </radialGradient>

          {/* River water reflection gradient */}
          <linearGradient id="riverReflection" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#f97316" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#9333ea" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.95" />
          </linearGradient>

          {/* Comet / Shooting star trail gradient */}
          <linearGradient id="cometGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="cometGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="70%" stopColor="#fed7aa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
          </linearGradient>

          {/* Cherry blossom flower petal gradient */}
          <linearGradient id="sakuraPetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>

          {/* Maple leaf gradient */}
          <linearGradient id="mapleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>

        {/* 1. Base Sky and Golden Sunset Glow */}
        <rect width="1440" height="810" fill="url(#twilightSky)" />
        <rect width="1440" height="810" fill="url(#sunBurst)" />

        {/* 2. Anime Clouds with warm sunset tint */}
        <g fill="#fed7aa" opacity="0.35">
          <ellipse cx="280" cy="380" rx="260" ry="45" />
          <ellipse cx="420" cy="360" rx="200" ry="50" />
          <ellipse cx="1160" cy="390" rx="300" ry="55" />
          <ellipse cx="980" cy="370" rx="240" ry="48" />
        </g>
        <g fill="#f472b6" opacity="0.25">
          <ellipse cx="680" cy="320" rx="350" ry="40" />
          <ellipse cx="780" cy="310" rx="280" ry="45" />
        </g>

        {/* 3. Comet / Shooting Star Streaks across the upper sky */}
        <line x1="680" y1="90" x2="820" y2="180" stroke="url(#cometGrad1)" strokeWidth="3" strokeLinecap="round" />
        <line x1="675" y1="90" x2="820" y2="180" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="820" cy="180" r="2.5" fill="#ffffff" />

        <line x1="960" y1="80" x2="1080" y2="190" stroke="url(#cometGrad2)" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="1080" cy="190" r="3" fill="#ffffff" />

        {/* 4. Distant Mountains and Metropolis Horizon */}
        <path
          d="M0 550 Q 240 520 480 545 T 960 540 Q 1200 525 1440 550 L1440 810 L0 810 Z"
          fill="#4c1d95"
          opacity="0.35"
        />

        {/* Modern Skyline Silhouette in Distance */}
        <g fill="#2e1065" opacity="0.75">
          <rect x="220" y="470" width="45" height="90" />
          <rect x="290" y="490" width="35" height="70" />
          <rect x="360" y="450" width="50" height="110" />
          <polygon points="385,420 360,450 410,450" />
          <rect x="440" y="480" width="40" height="80" />
          <rect x="520" y="440" width="60" height="120" />
          <rect x="620" y="460" width="45" height="100" />
          {/* Iconic Skyscraper Tower */}
          <polygon points="720,400 705,480 735,480" />
          <rect x="705" y="480" width="30" height="80" />
          <rect x="770" y="465" width="55" height="95" />
          <rect x="860" y="450" width="50" height="110" />
          <rect x="940" y="485" width="45" height="75" />
          <rect x="1010" y="435" width="40" height="125" />
          <rect x="1080" y="475" width="60" height="85" />
        </g>

        {/* Glowing River / Bay with Sunset Water Reflection */}
        <path
          d="M0 555 Q 720 545 1440 555 L1440 610 Q 720 625 0 610 Z"
          fill="url(#riverReflection)"
        />

        {/* Bridge across the river */}
        <line x1="480" y1="565" x2="960" y2="565" stroke="#fed7aa" strokeWidth="2.5" opacity="0.8" />
        <line x1="520" y1="565" x2="520" y2="575" stroke="#fed7aa" strokeWidth="2" opacity="0.8" />
        <line x1="680" y1="565" x2="680" y2="575" stroke="#fed7aa" strokeWidth="2" opacity="0.8" />
        <line x1="840" y1="565" x2="840" y2="575" stroke="#fed7aa" strokeWidth="2" opacity="0.8" />

        {/* Mid-ground Town Rooftops, Clock Tower, Autumn Trees */}
        <path
          d="M0 600 Q 720 590 1440 600 L1440 690 Q 720 705 0 690 Z"
          fill="#1e1b4b"
          opacity="0.85"
        />

        {/* Clock tower silhouette */}
        <g fill="#311042">
          <rect x="1040" y="560" width="40" height="80" />
          <polygon points="1060,530 1035,560 1085,560" />
          <circle cx="1060" cy="575" r="5" fill="#fef08a" opacity="0.9" />
        </g>

        {/* Foreground Stone Balcony Terrace */}
        <path
          d="M0 690 Q 720 675 1440 690 L1440 810 L0 810 Z"
          fill="#110d24"
        />

        {/* Stone Terrace Pillars & Floral Bushes */}
        <g fill="#090615">
          <rect x="260" y="660" width="40" height="90" rx="3" />
          <rect x="1100" y="660" width="40" height="90" rx="3" />
        </g>

        {/* 5. TOP-LEFT: Cherry Blossom Tree Branches (Cánh hoa đào hồng phấn) */}
        <g>
          {/* Dark wooden branches */}
          <path
            d="M -30 -30 Q 120 70 250 80 Q 340 140 280 230"
            stroke="#1c1124"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 120 70 Q 220 30 360 40"
            stroke="#1c1124"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 180 120 Q 220 200 320 240"
            stroke="#1c1124"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />

          {/* Clusters of Blooming Sakura Flowers */}
          {[
            { cx: 80, cy: 40, r: 16 },
            { cx: 140, cy: 65, r: 18 },
            { cx: 180, cy: 50, r: 15 },
            { cx: 230, cy: 45, r: 17 },
            { cx: 280, cy: 55, r: 14 },
            { cx: 330, cy: 45, r: 15 },
            { cx: 110, cy: 110, r: 18 },
            { cx: 160, cy: 115, r: 16 },
            { cx: 210, cy: 130, r: 15 },
            { cx: 260, cy: 160, r: 17 },
            { cx: 290, cy: 210, r: 16 },
            { cx: 320, cy: 240, r: 14 },
            { cx: 50, cy: 90, r: 16 },
            { cx: 70, cy: 160, r: 15 },
            { cx: 20, cy: 140, r: 14 },
          ].map((c, i) => (
            <g key={`sakura-${i}`} transform={`translate(${c.cx}, ${c.cy})`}>
              {/* 5 Petals */}
              {[0, 72, 144, 216, 288].map((angle, j) => (
                <ellipse
                  key={j}
                  cx="0"
                  cy={-c.r * 0.7}
                  rx={c.r * 0.55}
                  ry={c.r * 0.75}
                  fill="url(#sakuraPetal)"
                  transform={`rotate(${angle})`}
                  opacity="0.95"
                />
              ))}
              <circle cx="0" cy="0" r={c.r * 0.25} fill="#f43f5e" />
              <circle cx="0" cy="0" r={c.r * 0.12} fill="#ffffff" />
            </g>
          ))}

          {/* Falling / Drifting Sakura Petals */}
          {[
            { cx: 180, cy: 300, rot: 25, s: 1.2 },
            { cx: 280, cy: 360, rot: 55, s: 1.0 },
            { cx: 340, cy: 290, rot: 15, s: 1.3 },
            { cx: 220, cy: 430, rot: 40, s: 1.1 },
            { cx: 400, cy: 380, rot: 70, s: 0.9 },
            { cx: 150, cy: 480, rot: 30, s: 1.2 },
            { cx: 290, cy: 520, rot: 80, s: 1.0 },
            { cx: 380, cy: 460, rot: 10, s: 1.1 },
          ].map((p, i) => (
            <path
              key={`petal-${i}`}
              d="M 0 -10 C 6 -10 10 -4 10 2 C 10 8 4 12 0 16 C -4 12 -10 8 -10 2 C -10 -4 -6 -10 0 -10 Z"
              fill="url(#sakuraPetal)"
              transform={`translate(${p.cx}, ${p.cy}) rotate(${p.rot}) scale(${p.s})`}
              opacity="0.85"
            />
          ))}
        </g>

        {/* 6. TOP-RIGHT: Autumn Maple Branches (Lá phong mùa thu cam đỏ) */}
        <g>
          {/* Branch path */}
          <path
            d="M 1480 -20 Q 1340 50 1220 80 Q 1120 120 1160 210"
            stroke="#1c1124"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 1340 50 Q 1240 10 1140 30"
            stroke="#1c1124"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />

          {/* Maple Leaves Clusters */}
          {[
            { cx: 1390, cy: 40, s: 1.5, rot: 10 },
            { cx: 1340, cy: 70, s: 1.6, rot: 35 },
            { cx: 1290, cy: 50, s: 1.4, rot: -20 },
            { cx: 1240, cy: 80, s: 1.7, rot: 45 },
            { cx: 1180, cy: 90, s: 1.5, rot: -15 },
            { cx: 1140, cy: 140, s: 1.4, rot: 25 },
            { cx: 1180, cy: 190, s: 1.6, rot: 60 },
            { cx: 1220, cy: 230, s: 1.3, rot: -30 },
            { cx: 1420, cy: 110, s: 1.4, rot: 40 },
            { cx: 1370, cy: 160, s: 1.5, rot: 15 },
          ].map((m, i) => (
            <g key={`maple-${i}`} transform={`translate(${m.cx}, ${m.cy}) rotate(${m.rot}) scale(${m.s})`}>
              <path
                d="M 0 0 L 0 -18 L 4 -12 L 10 -16 L 8 -9 L 14 -8 L 8 -2 L 12 4 L 4 2 L 0 8 L -4 2 L -12 4 L -8 -2 L -14 -8 L -8 -9 L -10 -16 L -4 -12 Z"
                fill="url(#mapleGrad)"
                opacity="0.95"
              />
            </g>
          ))}

          {/* Falling Maple Leaves */}
          {[
            { cx: 1180, cy: 280, s: 1.2, rot: 45 },
            { cx: 1280, cy: 340, s: 1.0, rot: -35 },
            { cx: 1340, cy: 410, s: 1.1, rot: 80 },
            { cx: 1220, cy: 450, s: 0.9, rot: 20 },
            { cx: 1140, cy: 400, s: 1.0, rot: -50 },
          ].map((m, i) => (
            <g key={`fmaple-${i}`} transform={`translate(${m.cx}, ${m.cy}) rotate(${m.rot}) scale(${m.s})`}>
              <path
                d="M 0 0 L 0 -16 L 4 -10 L 9 -14 L 7 -8 L 13 -7 L 7 -1 L 11 4 L 3 2 L 0 7 L -3 2 L -11 4 L -7 -1 L -13 -7 L -7 -8 L -9 -14 L -4 -10 Z"
                fill="url(#mapleGrad)"
                opacity="0.85"
              />
            </g>
          ))}
        </g>

        {/* 7. FOREGROUND STUDENTS SILHOUETTE: LEFT GROUP (3 Students) */}
        <g fill="#080410">
          {/* Student 1 (Boy with blazer & backpack) */}
          <path d="M 80 590 Q 110 520 140 590 L 145 780 L 70 780 Z" />
          <circle cx="110" cy="500" r="28" />
          {/* Backpack */}
          <rect x="65" y="550" width="35" height="75" rx="10" />

          {/* Student 2 (Boy with arm around friend, center-left) */}
          <path d="M 140 600 Q 175 530 210 600 L 215 780 L 135 780 Z" />
          <circle cx="175" cy="515" r="26" />
          <rect x="135" y="565" width="30" height="70" rx="8" />

          {/* Student 3 (Girl with ponytail and school skirt) */}
          <path d="M 210 610 Q 240 550 270 610 L 285 710 L 195 710 Z" />
          <circle cx="240" cy="535" r="24" />
          {/* Ponytail */}
          <path d="M 255 530 Q 285 540 280 570 Q 265 560 255 545 Z" />
          {/* Skirt */}
          <polygon points="205,710 275,710 290,780 190,780" />
          <rect x="230" y="575" width="28" height="60" rx="8" />
        </g>

        {/* 8. FOREGROUND STUDENTS SILHOUETTE: RIGHT GROUP (3 Students) */}
        <g fill="#080410">
          {/* Student 4 (Boy pointing towards sunset city) */}
          <path d="M 1180 600 Q 1215 530 1250 600 L 1255 780 L 1175 780 Z" />
          <circle cx="1215" cy="515" r="27" />
          {/* Pointing arm */}
          <path d="M 1205 570 Q 1160 550 1120 540 Q 1115 545 1125 555 Q 1165 565 1205 585 Z" />
          <rect x="1225" y="560" width="35" height="75" rx="10" />

          {/* Student 5 (Girl with twin-tail or neat bob) */}
          <path d="M 1250 610 Q 1280 550 1310 610 L 1325 710 L 1235 710 Z" />
          <circle cx="1280" cy="535" r="24" />
          <polygon points="1245,710 1315,710 1330,780 1230,780" />
          <rect x="1270" y="575" width="28" height="60" rx="8" />

          {/* Student 6 (Girl looking ahead, far right) */}
          <path d="M 1320 620 Q 1350 560 1380 620 L 1395 720 L 1305 720 Z" />
          <circle cx="1350" cy="545" r="23" />
          <polygon points="1315,720 1385,720 1400,780 1300,780" />
          <rect x="1340" y="585" width="26" height="55" rx="8" />
        </g>
      </svg>
    </div>
  );
};
