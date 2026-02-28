export default function AuTvyaLogo({ size = 'lg' }) {
  const sizes = {
    sm: { text: 22, arc: { w: 16, h: 7, sw: 2 } },
    md: { text: 28, arc: { w: 20, h: 9, sw: 2.5 } },
    lg: { text: 36, arc: { w: 26, h: 11, sw: 3 } },
    xl: { text: 48, arc: { w: 34, h: 14, sw: 3.5 } },
  };
  const s = sizes[size] || sizes.lg;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'flex-end', lineHeight: 1 }}>
      <span style={{ fontFamily: 'Inter, system-ui', fontWeight: 900, fontSize: s.text, color: '#1A3A6B', letterSpacing: '-0.02em' }}>
        AUT
      </span>
      <span style={{ position: 'relative', fontFamily: 'Inter, system-ui', fontWeight: 900, fontSize: s.text, color: '#4CAF50', letterSpacing: '-0.02em' }}>
        <svg
          style={{ position: 'absolute', top: -s.arc.h * 0.6, left: '50%', transform: 'translateX(-50%)' }}
          width={s.arc.w}
          height={s.arc.h}
          viewBox={`0 0 ${s.arc.w} ${s.arc.h}`}
        >
          <path
            d={`M2 ${s.arc.h - 1} Q${s.arc.w / 2} 1 ${s.arc.w - 2} ${s.arc.h - 1}`}
            stroke="#4CAF50"
            strokeWidth={s.arc.sw}
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        V
      </span>
      <span style={{ fontFamily: 'Inter, system-ui', fontWeight: 900, fontSize: s.text, color: '#1A3A6B', letterSpacing: '-0.02em' }}>
        YA
      </span>
    </div>
  );
}
