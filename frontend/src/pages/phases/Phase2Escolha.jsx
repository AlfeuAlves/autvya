/**
 * FASE 2 – ESCOLHA
 *
 * Baseada em: PECS Fase III (discriminação de símbolos) +
 *             Aided Language Stimulation (ALgS/ALS) +
 *             Two-step navigation (contexto → opção específica)
 *
 * Objetivo: A criança aprende a discriminar entre símbolos e fazer escolhas
 * significativas dentro de contextos específicos.
 *
 * Fluxo:
 *   Nível 1 → toque em categoria → Nível 2 → escolha específica → TTS + feedback → Nível 1
 */
import { useState, useRef } from 'react';
import { SYMBOLS, FASE1_SIMBOLOS_COMPACTO as FASE1_SIMBOLOS, FASE2_CONTEXTOS } from '../../data/vocabulary.js';

function PictoButton({ id, onPress, size = 'large' }) {
  const [pressed, setPressed] = useState(false);
  const sym = SYMBOLS[id];
  if (!sym) return null;

  const isLarge = size === 'large';

  function handle() {
    setPressed(true);
    setTimeout(() => setPressed(false), 180);
    onPress(id);
  }

  return (
    <button
      onPointerDown={handle}
      aria-label={sym.label}
      style={{
        background: sym.bg,
        boxShadow: pressed ? `0 2px 0 ${sym.shadow}` : `0 6px 0 ${sym.shadow}, 0 9px 16px rgba(0,0,0,0.16)`,
        transform: pressed ? 'translateY(4px)' : 'translateY(0)',
        transition: 'transform 0.1s, box-shadow 0.1s',
        borderRadius: 18,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        padding: isLarge ? '12px 6px 10px' : '10px 6px 8px',
        width: '100%',
        aspectRatio: '1',
      }}
    >
      <span style={{ fontSize: isLarge ? 'clamp(2rem, 8vw, 2.8rem)' : 'clamp(1.6rem, 6vw, 2.2rem)', lineHeight: 1 }}>
        {sym.icon}
      </span>
      <span style={{ color: 'white', fontWeight: 900, fontSize: isLarge ? 'clamp(0.65rem, 2.6vw, 0.9rem)' : 'clamp(0.6rem, 2.4vw, 0.8rem)', letterSpacing: '0.04em', textShadow: `0 1px 3px ${sym.shadow}` }}>
        {sym.label.toUpperCase()}
      </span>
    </button>
  );
}

export default function Phase2Escolha({ onInteracao }) {
  const [nivel, setNivel] = useState(1);
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [animando, setAnimando] = useState(false);
  const [estrelas, setEstrelas] = useState(0);
  const feedbackTimer = useRef(null);

  function handleCategoria(id) {
    const ctx = FASE2_CONTEXTOS[id];

    // "mais" e "não" são respostas diretas → registra e fica no nível 1
    if (!ctx) {
      onInteracao(id, { nivel: 1, contexto: 'categoria' });
      setEstrelas((e) => e + 1);
      setFeedbackMsg(id === 'nao' ? 'Tudo bem, sem problema! 💙' : 'Vamos ver mais opções! ➕');
      clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => setFeedbackMsg(null), 1500);
      return;
    }

    // Animar transição para nível 2
    setAnimando(true);
    setTimeout(() => {
      setCategoriaAtiva(id);
      setNivel(2);
      setAnimando(false);
    }, 200);
  }

  function handleOpcao(id) {
    const catSym = SYMBOLS[categoriaAtiva];
    const opcSym = SYMBOLS[id];

    // Registra interação com contexto
    onInteracao(id, { nivel: 2, contexto: categoriaAtiva });
    setEstrelas((e) => e + 1);

    // Feedback contextual (Aided Language: nomear a escolha completa)
    if (opcSym && catSym) {
      setFeedbackMsg(`${catSym.icon} ${opcSym.icon} ${opcSym.label}!`);
      clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => {
        setFeedbackMsg(null);
        // Volta ao nível 1 após feedback
        setAnimando(true);
        setTimeout(() => { setNivel(1); setCategoriaAtiva(null); setAnimando(false); }, 200);
      }, 1200);
    }
  }

  function voltarNivel1() {
    setAnimando(true);
    setTimeout(() => { setNivel(1); setCategoriaAtiva(null); setAnimando(false); }, 180);
  }

  const ctxAtual = categoriaAtiva ? FASE2_CONTEXTOS[categoriaAtiva] : null;
  const catSym = categoriaAtiva ? SYMBOLS[categoriaAtiva] : null;

  return (
    <div
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 16px', position: 'relative', zIndex: 2,
        opacity: animando ? 0 : 1, transition: 'opacity 0.18s ease' }}
    >
      {/* HUD */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 20 }}>⭐</span>
        <span style={{ fontWeight: 900, fontSize: 18, color: '#1A3A6B' }}>{estrelas}</span>
      </div>

      {/* Feedback de escolha */}
      {feedbackMsg && (
        <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.96)', borderRadius: 20, padding: '16px 28px', fontWeight: 900, fontSize: 22, color: '#1A3A6B', zIndex: 200, animation: 'bounceIn 0.3s ease-out', boxShadow: '0 8px 30px rgba(0,0,0,0.18)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          {feedbackMsg}
        </div>
      )}

      {nivel === 1 ? (
        <>
          {/* Instrução nível 1 */}
          <div style={{ textAlign: 'center', marginBottom: 12, fontWeight: 700, fontSize: 15, color: 'rgba(26,58,107,0.7)' }}>
            O que você quer? 🤔
          </div>

          {/* Grid 2×3 – categorias */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 380, margin: '0 auto', width: '100%' }}>
            {FASE1_SIMBOLOS.map((id) => (
              <PictoButton key={id} id={id} onPress={handleCategoria} size="large" />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Card de contexto – Aided Language Stimulation */}
          {catSym && ctxAtual && (
            <div style={{ background: `linear-gradient(135deg, ${catSym.bg}22, ${catSym.bg}44)`, border: `2px solid ${catSym.bg}`, borderRadius: 18, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, background: catSym.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                {catSym.icon}
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#7A9EB8', fontWeight: 600 }}>Você escolheu</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#1A3A6B' }}>{ctxAtual.prompt}</div>
              </div>
            </div>
          )}

          {/* Grid 2×2 – opções específicas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, maxWidth: 320, margin: '0 auto', width: '100%' }}>
            {ctxAtual?.opcoes.map((id) => (
              <PictoButton key={id} id={id} onPress={handleOpcao} size="large" />
            ))}
          </div>

          {/* Botão voltar */}
          <button
            onClick={voltarNivel1}
            style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: 14, padding: '10px 24px', fontWeight: 800, fontSize: 14, color: '#1A3A6B', cursor: 'pointer', backdropFilter: 'blur(6px)', alignSelf: 'center' }}
          >
            ← Voltar
          </button>
        </>
      )}

      <style>{`
        @keyframes bounceIn {
          0%  { transform: translateX(-50%) scale(0.7); opacity: 0; }
          60% { transform: translateX(-50%) scale(1.08); opacity: 1; }
          100%{ transform: translateX(-50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
