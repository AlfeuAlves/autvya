import { useState, useEffect } from 'react';

export default function SplashScreen({ onDone }) {
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSaindo(true), 2800);
    const t2 = setTimeout(onDone, 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(160deg, #6EC4E8 0%, #93D3EF 30%, #BDE5F5 60%, #EFF8FD 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 24,
      opacity: saindo ? 0 : 1,
      transition: 'opacity 0.5s ease',
    }}>

      {/* Nuvens decorativas */}
      <div style={{ position: 'absolute', left: -10, top: 30, opacity: 0.6, pointerEvents: 'none' }}>
        <div style={{ position: 'relative', width: 100, height: 40 }}>
          <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 60, height: 38, bottom: 0, left: 0 }} />
          <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 50, height: 32, bottom: 0, left: 28 }} />
          <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 36, height: 36, bottom: 6, left: 16 }} />
        </div>
      </div>
      <div style={{ position: 'absolute', right: 8, top: 20, opacity: 0.5, transform: 'scale(0.8)', pointerEvents: 'none' }}>
        <div style={{ position: 'relative', width: 100, height: 40 }}>
          <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 60, height: 38, bottom: 0, left: 0 }} />
          <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 50, height: 32, bottom: 0, left: 28 }} />
          <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 36, height: 36, bottom: 6, left: 16 }} />
        </div>
      </div>

      {/* Logo com spin + brilho */}
      <div style={{ perspective: 600 }}>
        <div style={{
          position: 'relative',
          width: 120,
          height: 120,
          animation: 'spinY 6s linear infinite',
        }}>
          <img
            src="/logoaltvya.png"
            alt="AuTvya"
            style={{ width: 120, height: 120, objectFit: 'contain', display: 'block' }}
          />
        </div>
      </div>

      {/* Tagline */}
      <p style={{
        fontWeight: 700,
        fontSize: 15,
        color: 'rgba(26,58,107,0.65)',
        letterSpacing: '0.06em',
        animation: 'fadeUp 0.8s ease-out forwards',
      }}>
        Comunicação que transforma vidas
      </p>

      <style>{`
        @keyframes spinY {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
@keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
