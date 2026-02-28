/**
 * FASE 1 – CONEXÃO
 *
 * Baseada em: PECS Fases I–II (Bondy & Frost) + princípios de reforço positivo
 *
 * Objetivo: A criança aprende que tocar um símbolo = comunicação.
 * Mecânica: causa-efeito imediato (toque → voz + animação + recompensa).
 * Critério de avanço: 20+ interações, 7+ dias, 4+ símbolos distintos.
 */
import { useState, useRef } from 'react';
import { SYMBOLS, FASE1_SIMBOLOS, FASE1_SIMBOLOS_COMPACTO } from '../../data/vocabulary.js';

function PictoButton({ id, onPress }) {
  const [pressed, setPressed] = useState(false);
  const sym = SYMBOLS[id];
  if (!sym) return null;

  function handle() {
    setPressed(true);
    setTimeout(() => setPressed(false), 200);
    onPress(id);
  }

  return (
    <button
      onPointerDown={handle}
      aria-label={sym.label}
      style={{
        background: sym.bg,
        boxShadow: pressed
          ? `0 2px 0 ${sym.shadow}`
          : `0 7px 0 ${sym.shadow}, 0 10px 18px rgba(0,0,0,0.18)`,
        transform: pressed ? 'translateY(5px)' : 'translateY(0)',
        transition: 'transform 0.1s, box-shadow 0.1s',
        borderRadius: 20,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '14px 8px 12px',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* brilhos */}
      <span style={{ position: 'absolute', top: 7, right: 9, fontSize: 10, opacity: 0.65 }}>✦</span>
      <span style={{ fontSize: 'clamp(2rem, 9vw, 3rem)', lineHeight: 1 }}>{sym.icon}</span>
      <span style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(0.7rem, 2.8vw, 0.95rem)', letterSpacing: '0.04em', textShadow: `0 2px 4px ${sym.shadow}` }}>
        {sym.label.toUpperCase()}
      </span>
    </button>
  );
}

function CelebracaoOverlay({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, cursor: 'pointer' }}
    >
      <div style={{ background: 'white', borderRadius: 28, padding: '32px 40px', textAlign: 'center', animation: 'bounceIn 0.4s ease-out', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ fontSize: 72, marginBottom: 8 }}>🎉</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#1A3A6B', marginBottom: 4 }}>Muito bem!</div>
        <div style={{ fontSize: 16, color: '#7A9EB8', marginBottom: 20 }}>Continue assim! ⭐</div>
        <button
          style={{ background: '#4A90D9', color: 'white', border: 'none', borderRadius: 16, padding: '12px 32px', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default function Phase1Conexao({ onInteracao, modoCompacto = false, isLandscape = false }) {
  const [estrelas, setEstrelas] = useState(0);
  const [feedbackId, setFeedbackId] = useState(null);
  const [celebrando, setCelebrando] = useState(false);
  const feedbackTimer = useRef(null);
  // Marco de celebração a cada 5 estrelas
  const MARCO = 5;

  function handlePress(id) {
    onInteracao(id);

    // Feedback visual do símbolo pulsado
    setFeedbackId(id);
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedbackId(null), 700);

    // Gamificação: estrela + celebração a cada MARCO
    setEstrelas((prev) => {
      const next = prev + 1;
      if (next % MARCO === 0) setCelebrando(true);
      return next;
    });
  }

  const sym = feedbackId ? SYMBOLS[feedbackId] : null;

  const simbolos = modoCompacto ? FASE1_SIMBOLOS_COMPACTO : FASE1_SIMBOLOS;
  const colunas  = modoCompacto ? 3 : 4;
  const gap      = modoCompacto ? 14 : 9;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 12px 12px', position: 'relative', zIndex: 2 }}>

      {/* HUD de estrelas – mais compacto em landscape */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: isLandscape ? 4 : 8 }}>
        <span style={{ fontSize: isLandscape ? 16 : 22 }}>⭐</span>
        <span style={{ fontWeight: 900, fontSize: isLandscape ? 15 : 20, color: '#1A3A6B' }}>{estrelas}</span>
        {estrelas > 0 && !isLandscape && (
          <span style={{ fontSize: 12, color: '#7A9EB8', fontWeight: 600 }}>
            {MARCO - (estrelas % MARCO || MARCO)} para próxima celebração!
          </span>
        )}
      </div>

      {/* Feedback animado do símbolo tocado */}
      {sym && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}>
          <div style={{ background: sym.bg, borderRadius: 28, padding: '20px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'popFeedback 0.6s ease-out forwards', boxShadow: `0 12px 40px ${sym.shadow}88` }}>
            <span style={{ fontSize: 64 }}>{sym.icon}</span>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 22 }}>{sym.label}</span>
          </div>
        </div>
      )}

      {/* Grid dinâmico – preenche toda a área disponível */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: `repeat(${colunas}, 1fr)`,
        gridAutoRows: '1fr',
        gap,
        width: '100%',
      }}>
        {simbolos.map((id) => (
          <PictoButton key={id} id={id} onPress={handlePress} />
        ))}
      </div>

      {/* Dica visual – oculta em landscape para maximizar área do grid */}
      {!isLandscape && (
        <div style={{ marginTop: 8, textAlign: 'center', color: 'rgba(26,58,107,0.55)', fontSize: 13, fontWeight: 600 }}>
          Toque em uma imagem para falar 🔊
        </div>
      )}

      {/* Celebração */}
      {celebrando && <CelebracaoOverlay onClose={() => setCelebrando(false)} />}

      <style>{`
        @keyframes popFeedback {
          0%   { transform: scale(0.5); opacity: 0; }
          50%  { transform: scale(1.15); opacity: 1; }
          80%  { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes bounceIn {
          0%  { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100%{ transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
