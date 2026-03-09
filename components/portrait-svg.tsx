interface PortraitSVGProps {
  chapter: number;
  revealProgress: number;
}

export default function PortraitSVG({ chapter, revealProgress }: PortraitSVGProps) {
  const strokeDasharray = 1000;
  const strokeDashoffset = strokeDasharray * (1 - revealProgress);

  // Different portrait reveals per chapter
  const getPortraitLayers = () => {
    switch (chapter) {
      case 0: // Mujer Amante - Basic outline
        return (
          <>
            {/* Head outline */}
            <circle
              cx="150"
              cy="100"
              r="45"
              fill="none"
              stroke="var(--accent-warm)"
              strokeWidth="2"
              opacity={revealProgress}
            />
            {/* Neck */}
            <line
              x1="135"
              y1="140"
              x2="135"
              y2="180"
              stroke="var(--accent-warm)"
              strokeWidth="2"
              opacity={revealProgress}
            />
            <line
              x1="165"
              y1="140"
              x2="165"
              y2="180"
              stroke="var(--accent-warm)"
              strokeWidth="2"
              opacity={revealProgress}
            />
          </>
        );

      case 1: // Princesa - More details
        return (
          <>
            {/* Head */}
            <circle
              cx="150"
              cy="100"
              r="45"
              fill="none"
              stroke="var(--accent-warm)"
              strokeWidth="2"
              opacity={revealProgress}
            />
            {/* Hair */}
            <path
              d="M 105 100 Q 100 50 150 40 Q 200 50 195 100"
              fill="none"
              stroke="var(--accent-warm)"
              strokeWidth="3"
              opacity={revealProgress}
            />
            {/* Face details */}
            <circle cx="135" cy="95" r="4" fill="var(--accent-warm)" opacity={revealProgress} />
            <circle cx="165" cy="95" r="4" fill="var(--accent-warm)" opacity={revealProgress} />
            {/* Smile */}
            <path
              d="M 140 115 Q 150 125 160 115"
              fill="none"
              stroke="var(--accent-warm)"
              strokeWidth="2"
              opacity={revealProgress}
            />
            {/* Neck */}
            <rect x="130" y="140" width="40" height="40" fill="none" stroke="var(--accent-warm)" strokeWidth="2" opacity={revealProgress} />
          </>
        );

      case 2: // Lo Más Fino - Full elegance
        return (
          <>
            {/* Complete head */}
            <circle
              cx="150"
              cy="100"
              r="45"
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="2"
              opacity={revealProgress}
            />
            {/* Long flowing hair */}
            <path
              d="M 105 100 Q 95 60 100 30 Q 150 20 200 30 Q 205 60 195 100"
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="3"
              opacity={revealProgress}
            />
            {/* Detailed eyes */}
            <g opacity={revealProgress}>
              <circle cx="135" cy="95" r="5" fill="var(--accent-gold)" />
              <circle cx="165" cy="95" r="5" fill="var(--accent-gold)" />
              <circle cx="135" cy="95" r="2" fill="var(--bg-darker)" />
              <circle cx="165" cy="95" r="2" fill="var(--bg-darker)" />
            </g>
            {/* Radiant smile */}
            <path
              d="M 138 120 Q 150 130 162 120"
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="2"
              opacity={revealProgress}
            />
            {/* Earrings */}
            <circle cx="105" cy="105" r="3" fill="var(--accent-gold)" opacity={revealProgress} />
            <circle cx="195" cy="105" r="3" fill="var(--accent-gold)" opacity={revealProgress} />
            {/* Shoulders/dress */}
            <path
              d="M 110 140 Q 150 170 190 140"
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="3"
              opacity={revealProgress}
            />
          </>
        );

      case 3: // La Vuelta al Mundo - Full portrait looking at moon
      default:
        return (
          <>
            {/* Complete elegant head */}
            <ellipse
              cx="150"
              cy="100"
              rx="48"
              ry="50"
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="2"
              opacity={revealProgress}
            />
            {/* Long elegant hair */}
            <path
              d="M 102 100 Q 90 50 95 20 Q 150 10 205 20 Q 210 50 198 100"
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="3"
              opacity={revealProgress}
            />
            {/* Hair detail - waves */}
            <path
              d="M 105 120 Q 110 140 105 160"
              fill="none"
              stroke="var(--accent-warm)"
              strokeWidth="2"
              opacity={revealProgress * 0.7}
            />
            <path
              d="M 195 120 Q 190 140 195 160"
              fill="none"
              stroke="var(--accent-warm)"
              strokeWidth="2"
              opacity={revealProgress * 0.7}
            />
            {/* Expressive eyes looking up */}
            <g opacity={revealProgress}>
              <circle cx="132" cy="90" r="6" fill="var(--accent-gold)" />
              <circle cx="168" cy="90" r="6" fill="var(--accent-gold)" />
              <circle cx="132" cy="88" r="3" fill="var(--bg-darker)" />
              <circle cx="168" cy="88" r="3" fill="var(--bg-darker)" />
              {/* Eyebrows */}
              <path d="M 120 80 Q 132 75 144 80" fill="none" stroke="var(--accent-warm)" strokeWidth="1.5" />
              <path d="M 156 80 Q 168 75 180 80" fill="none" stroke="var(--accent-warm)" strokeWidth="1.5" />
            </g>
            {/* Nose */}
            <line
              x1="150"
              y1="95"
              x2="150"
              y2="115"
              stroke="var(--accent-warm)"
              strokeWidth="1"
              opacity={revealProgress * 0.6}
            />
            {/* Beautiful smile */}
            <path
              d="M 135 125 Q 150 135 165 125"
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="2.5"
              opacity={revealProgress}
            />
            {/* Elegant earrings */}
            <g opacity={revealProgress}>
              <circle cx="102" cy="110" r="4" fill="var(--accent-gold)" />
              <circle cx="102" cy="125" r="2" fill="var(--accent-moon)" />
              <circle cx="198" cy="110" r="4" fill="var(--accent-gold)" />
              <circle cx="198" cy="125" r="2" fill="var(--accent-moon)" />
            </g>
            {/* Neck and shoulders */}
            <g opacity={revealProgress}>
              <line x1="135" y1="150" x2="135" y2="180" stroke="var(--accent-warm)" strokeWidth="2" />
              <line x1="165" y1="150" x2="165" y2="180" stroke="var(--accent-warm)" strokeWidth="2" />
              <path
                d="M 115 170 Q 150 190 185 170"
                fill="none"
                stroke="var(--accent-gold)"
                strokeWidth="3"
              />
            </g>
          </>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 300 300"
      className="w-full h-full"
      style={{
        filter: `drop-shadow(0 0 ${revealProgress * 15}px var(--accent-gold))`,
      }}
    >
      <defs>
        <style>
          {`
            @keyframes portraitGlow {
              0%, 100% { filter: drop-shadow(0 0 5px var(--accent-gold)); }
              50% { filter: drop-shadow(0 0 15px var(--accent-gold)); }
            }
          `}
        </style>
      </defs>

      {/* Background subtle circle */}
      <circle
        cx="150"
        cy="150"
        r="140"
        fill="none"
        stroke="var(--accent-gold)"
        strokeWidth="1"
        opacity={revealProgress * 0.3}
      />

      {/* Portrait layers */}
      {getPortraitLayers()}
    </svg>
  );
}
