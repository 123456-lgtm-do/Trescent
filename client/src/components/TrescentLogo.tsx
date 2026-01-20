export default function TrescentLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="20%" stopColor="#d946ef" />
          <stop offset="40%" stopColor="#a855f7" />
          <stop offset="60%" stopColor="#6366f1" />
          <stop offset="80%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        
        <radialGradient id="innerShadow" cx="50%" cy="50%">
          <stop offset="60%" stopColor="#000000" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
        </radialGradient>
        
        <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer glow layer */}
      <circle
        cx="60"
        cy="60"
        r="35"
        stroke="url(#ringGradient)"
        strokeWidth="16"
        fill="none"
        filter="url(#outerGlow)"
        opacity="0.4"
      />
      
      {/* Main thick ring */}
      <circle
        cx="60"
        cy="60"
        r="35"
        stroke="url(#ringGradient)"
        strokeWidth="14"
        fill="none"
        opacity="1"
      />
      
      {/* Highlight layer (top edge) */}
      <circle
        cx="60"
        cy="60"
        r="41"
        stroke="url(#ringGradient)"
        strokeWidth="3"
        fill="none"
        opacity="0.8"
        filter="url(#innerGlow)"
      />
      
      {/* Inner shadow ring */}
      <circle
        cx="60"
        cy="60"
        r="29"
        stroke="url(#ringGradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      
      {/* Dark inner circle for depth */}
      <circle
        cx="60"
        cy="60"
        r="27"
        fill="url(#innerShadow)"
        opacity="0.8"
      />
      
      {/* Vertical white line in center - with subtle shadow */}
      <rect
        x="56"
        y="38"
        width="8"
        height="32"
        rx="4"
        fill="#ffffff"
        opacity="0.98"
        filter="url(#innerGlow)"
      />
    </svg>
  );
}
