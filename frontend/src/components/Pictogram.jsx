import { useState } from 'react';

const PICTOGRAM_CONFIG = {
  agua:    { icon: '💧', label: 'ÁGUA',    bg: '#3FA9F5', shadowColor: '#1F7FC7', sparkle: true },
  comer:   { icon: '🍎', label: 'COMER',   bg: '#F05A30', shadowColor: '#C03818', sparkle: true },
  brincar: { icon: '🎈', label: 'BRINCAR', bg: '#6DC420', shadowColor: '#4E9015', sparkle: true },
  mais:    { icon: '➕', label: 'MAIS',    bg: '#9468CC', shadowColor: '#6840A8', sparkle: false },
  dormir:  { icon: '😴', label: 'DORMIR',  bg: '#20B8B2', shadowColor: '#158A85', sparkle: true },
  nao:     { icon: '✖️', label: 'NÃO',     bg: '#E83535', shadowColor: '#B82020', sparkle: false },
};

export default function Pictogram({ id, onPress, disabled = false }) {
  const [pressed, setPressed] = useState(false);
  const cfg = PICTOGRAM_CONFIG[id] || {
    icon: '❓', label: id.toUpperCase(), bg: '#888', shadowColor: '#555', sparkle: false,
  };

  function handlePress() {
    if (disabled) return;
    setPressed(true);
    setTimeout(() => setPressed(false), 200);
    onPress?.(id);
  }

  return (
    <button
      onPointerDown={handlePress}
      disabled={disabled}
      aria-label={cfg.label}
      style={{
        backgroundColor: cfg.bg,
        boxShadow: pressed
          ? `0 2px 0 ${cfg.shadowColor}, 0 4px 12px rgba(0,0,0,0.2)`
          : `0 8px 0 ${cfg.shadowColor}, 0 12px 20px rgba(0,0,0,0.18)`,
        transform: pressed ? 'translateY(6px)' : 'translateY(0)',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
        borderRadius: 22,
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '16px 8px 14px',
        width: '100%',
        aspectRatio: '1',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Brilhos decorativos */}
      {cfg.sparkle && (
        <>
          <span style={{ position: 'absolute', top: 8, right: 10, fontSize: 11, opacity: 0.7 }}>✦</span>
          <span style={{ position: 'absolute', bottom: 28, left: 8, fontSize: 8, opacity: 0.5 }}>★</span>
        </>
      )}

      {/* Ícone */}
      <span style={{ fontSize: 'clamp(2.2rem, 8vw, 3.2rem)', lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
        {cfg.icon}
      </span>

      {/* Label */}
      <span style={{
        color: 'white',
        fontWeight: 900,
        fontSize: 'clamp(0.75rem, 3vw, 1rem)',
        letterSpacing: '0.04em',
        textShadow: `0 2px 4px ${cfg.shadowColor}`,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        {cfg.label}
      </span>
    </button>
  );
}

