export default function RobotMascot({ size = 80, waving = false }) {
  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 80 100"
      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.18))', transition: 'transform 0.3s', transform: waving ? 'rotate(-5deg)' : 'none' }}
    >
      {/* Antena esquerda */}
      <line x1="28" y1="6" x2="22" y2="0" stroke="#4A90D9" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="21" cy="0" r="3.5" fill="#5AABEE" />
      {/* Antena direita */}
      <line x1="52" y1="6" x2="58" y2="0" stroke="#4A90D9" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="59" cy="0" r="3.5" fill="#5AABEE" />

      {/* Cabeça */}
      <rect x="14" y="8" width="52" height="40" rx="16" fill="#4A90D9" />
      {/* Brilho cabeça */}
      <ellipse cx="30" cy="14" rx="8" ry="4" fill="white" opacity="0.2" />

      {/* Olho esquerdo */}
      <circle cx="27" cy="24" r="9" fill="white" />
      <circle cx="27" cy="25" r="6" fill="#1A5FAA" />
      <circle cx="27" cy="25" r="3" fill="#0A3F8A" />
      <circle cx="25" cy="23" r="2" fill="white" />

      {/* Olho direito */}
      <circle cx="53" cy="24" r="9" fill="white" />
      <circle cx="53" cy="25" r="6" fill="#1A5FAA" />
      <circle cx="53" cy="25" r="3" fill="#0A3F8A" />
      <circle cx="51" cy="23" r="2" fill="white" />

      {/* Bochechas */}
      <circle cx="16" cy="34" r="5" fill="#FF9999" opacity="0.55" />
      <circle cx="64" cy="34" r="5" fill="#FF9999" opacity="0.55" />

      {/* Sorriso */}
      <path d="M24 38 Q40 48 56 38" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Corpo */}
      <rect x="10" y="50" width="60" height="36" rx="14" fill="#3A7BC8" />
      {/* Brilho corpo */}
      <ellipse cx="26" cy="56" rx="6" ry="3" fill="white" opacity="0.15" />
      {/* Barriga */}
      <circle cx="40" cy="68" r="10" fill="#5A9FE8" />
      <circle cx="40" cy="68" r="6" fill="#4A90D9" />

      {/* Braço esquerdo */}
      <rect x="-2" y="53" width="15" height="11" rx="5.5" fill="#4A90D9" />
      <circle cx="4" cy="68" r="6" fill="#5AABEE" />
      {/* Mão acenando */}
      <line x1="1" y1="66" x2="-2" y2="60" stroke="#7ABFEE" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="4" y1="65" x2="4" y2="58" stroke="#7ABFEE" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="7" y1="66" x2="9" y2="59" stroke="#7ABFEE" strokeWidth="2.5" strokeLinecap="round" />

      {/* Braço direito */}
      <rect x="67" y="53" width="15" height="11" rx="5.5" fill="#4A90D9" />
      <circle cx="76" cy="68" r="6" fill="#5AABEE" />

      {/* Pernas */}
      <rect x="16" y="84" width="18" height="14" rx="7" fill="#3070B8" />
      <rect x="46" y="84" width="18" height="14" rx="7" fill="#3070B8" />
    </svg>
  );
}
