interface MoonSVGProps {
  scrollProgress: number;
}

export default function MoonSVG({ scrollProgress }: MoonSVGProps) {
  // Animate moon breathing effect
  const moonRadius = 120 + Math.sin(Date.now() / 1000) * 5;
  const glowIntensity = 0.3 + Math.sin(Date.now() / 1500) * 0.2;

  return (
    <svg
      viewBox="0 0 300 300"
      className="w-full h-full"
      style={{
        filter: `drop-shadow(0 0 ${20 + glowIntensity * 10}px var(--accent-moon))`,
      }}
    >
      {/* Outer glow */}
      <defs>
        <radialGradient id="moonGradient" cx="35%" cy="35%">
          <stop offset="0%" stopColor="var(--accent-moon)" stopOpacity="1" />
          <stop offset="60%" stopColor="var(--accent-warm)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--accent-warm)" stopOpacity="0.3" />
        </radialGradient>

        <filter id="moonGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main moon circle */}
      <circle
        cx="150"
        cy="150"
        r={moonRadius}
        fill="url(#moonGradient)"
        filter="url(#moonGlow)"
        style={{
          transition: 'r 0.3s ease-in-out',
        }}
      />

      {/* Moon craters/texture */}
      <ellipse cx="130" cy="120" rx="20" ry="25" fill="var(--accent-warm)" opacity="0.4" />
      <ellipse cx="170" cy="160" rx="15" ry="18" fill="var(--accent-warm)" opacity="0.3" />
      <circle cx="150" cy="180" r="12" fill="var(--accent-warm)" opacity="0.25" />

      {/* Subtle highlights */}
      <ellipse cx="120" cy="110" rx="30" ry="35" fill="white" opacity="0.15" />
    </svg>
  );
}
