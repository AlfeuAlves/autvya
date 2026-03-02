/**
 * FASE 3 – COMUNICAÇÃO
 *
 * Baseada em: Core Vocabulary AAC (Beukelman & Miranda, 2013) +
 *             LAMP – Language Acquisition through Motor Planning +
 *             Frases portadoras ("carrier phrases") +
 *             Vocabulário núcleo + periférico (core + fringe)
 *
 * Objetivo: A criança combina 2–4 símbolos para formar mensagens completas
 * com estrutura sujeito + verbo + objeto.
 *
 * Princípios LAMP aplicados:
 *   – Posição consistente de cada símbolo (motor planning)
 *   – Acesso com 1 toque (sem navegação profunda)
 *   – TTS imediato em cada seleção + ao falar a frase completa
 */
import { useState, useRef } from 'react';
import { SYMBOLS, FASE3_ABAS, FASE3_TEMPLATES } from '../../data/vocabulary.js';

const MAX_FRASE = 5;

function MiniSymbol({ id, onPress }) {
  const [pressed, setPressed] = useState(false);
  const sym = SYMBOLS[id];
  if (!sym) return null;

  function handle() {
    setPressed(true);
    setTimeout(() => setPressed(false), 150);
    onPress(id);
  }

  return (
    <button
      onPointerDown={handle}
      aria-label={sym.label}
      style={{
        background: sym.bg,
        boxShadow: pressed ? `0 2px 0 ${sym.shadow}` : `0 5px 0 ${sym.shadow}`,
        transform: pressed ? 'translateY(3px)' : 'translateY(0)',
        transition: 'transform 0.08s, box-shadow 0.08s',
        borderRadius: 14,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        padding: '8px 4px 6px',
        width: '100%',
        aspectRatio: '1',
      }}
    >
      <span style={{ fontSize: 'clamp(1.4rem, 5vw, 1.9rem)', lineHeight: 1 }}>{sym.icon}</span>
      <span style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(0.55rem, 1.8vw, 0.7rem)', letterSpacing: '0.03em' }}>
        {sym.label.toUpperCase()}
      </span>
    </button>
  );
}

function FrasePill({ id, index, onRemove }) {
  const sym = SYMBOLS[id];
  if (!sym) return null;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: sym.bg, borderRadius: 12, padding: '5px 8px 5px 6px', animation: 'popIn 0.2s ease-out', flexShrink: 0 }}>
      <span style={{ fontSize: 18, lineHeight: 1 }}>{sym.icon}</span>
      <span style={{ color: 'white', fontWeight: 800, fontSize: 12 }}>{sym.label}</span>
      <button
        onPointerDown={() => onRemove(index)}
        style={{ background: 'rgba(0,0,0,0.22)', border: 'none', borderRadius: '50%', width: 17, height: 17, color: 'white', cursor: 'pointer', fontSize: 11, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 2, padding: 0 }}
      >
        ×
      </button>
    </div>
  );
}

export default function Phase3Comunicacao({ onInteracao, speak }) {
  const [frase, setFrase] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('acoes');
  const [historico, setHistorico] = useState([]);
  const [falando, setFalando] = useState(false);
  const [estrelas, setEstrelas] = useState(0);

  const abaAtual = FASE3_ABAS.find((a) => a.id === abaAtiva) || FASE3_ABAS[0];

  function adicionarSimbolo(id) {
    if (frase.length >= MAX_FRASE) return;
    const sym = SYMBOLS[id];
    // TTS imediato no toque (motor planning – feedback instantâneo)
    speak?.(sym?.tts || id);
    setFrase((prev) => [...prev, id]);
    onInteracao(id, { nivel: 3, contexto: 'construcao' });
    setEstrelas((e) => e + 1);
  }

  function removerSimbolo(index) {
    setFrase((prev) => prev.filter((_, i) => i !== index));
  }

  function falarFrase() {
    if (frase.length === 0) return;
    // 'mais' é símbolo de navegação — não é pronunciado na frase
    const texto = frase
      .filter((id) => id !== 'mais')
      .map((id) => SYMBOLS[id]?.tts || id)
      .join(' ');
    if (!texto) return;
    speak?.(texto);
    setFalando(true);
    setTimeout(() => setFalando(false), 1500);
    // Salvar no histórico
    const fraseCompleta = frase.map((id) => SYMBOLS[id]?.label).join(' ');
    setHistorico((prev) => [fraseCompleta, ...prev].slice(0, 3));
    // Registrar como interação completa
    onInteracao(`frase:${frase.join('+')}`, { nivel: 3, contexto: 'frase_completa', frase });
  }

  function limparFrase() {
    setFrase([]);
  }

  function aplicarTemplate(template) {
    setFrase(template.simbolos);
    speak?.(template.tts);
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', gap: 10, padding: '0 10px 10px', position: 'relative', zIndex: 2 }}>

      {/* ── PAINEL ESQUERDO: frase + controles ────────────────────────── */}
      <div style={{ width: 168, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* HUD */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 16 }}>⭐</span>
            <span style={{ fontWeight: 900, fontSize: 15, color: '#1A3A6B' }}>{estrelas}</span>
          </div>
        </div>

        {/* Faixa de sentença */}
        <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 14, padding: '8px 10px', minHeight: 52, flex: 1, backdropFilter: 'blur(8px)', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflowY: 'auto' }}>
          {frase.length === 0 ? (
            <div style={{ color: '#9BB8D0', fontSize: 11, fontStyle: 'italic' }}>
              Toque nos símbolos para montar sua mensagem...
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {frase.map((id, i) => (
                <FrasePill key={i} id={id} index={i} onRemove={removerSimbolo} />
              ))}
            </div>
          )}
        </div>

        {/* Botão Falar */}
        <button
          onPointerDown={falarFrase}
          disabled={frase.length === 0}
          style={{ background: falando ? '#3A7BC8' : '#4A90D9', color: 'white', border: 'none', borderRadius: 14, padding: '12px 0', fontWeight: 900, fontSize: 14, cursor: frase.length === 0 ? 'default' : 'pointer', opacity: frase.length === 0 ? 0.5 : 1, boxShadow: frase.length > 0 ? '0 5px 0 #1A4F8A' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.1s', width: '100%' }}
        >
          🔊 Falar
        </button>

        {/* Botão Limpar */}
        <button
          onPointerDown={limparFrase}
          disabled={frase.length === 0}
          style={{ background: 'rgba(255,255,255,0.85)', color: '#E83535', border: '2px solid #FFCDD2', borderRadius: 14, padding: '9px 0', fontWeight: 800, fontSize: 13, cursor: frase.length === 0 ? 'default' : 'pointer', opacity: frase.length === 0 ? 0.5 : 1, width: '100%' }}
        >
          🗑️ Limpar
        </button>

        {/* Templates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {FASE3_TEMPLATES.map((t) => (
            <button
              key={t.label}
              onPointerDown={() => aplicarTemplate(t)}
              style={{ background: 'rgba(255,255,255,0.85)', border: '2px solid #BFDBFE', borderRadius: 10, padding: '6px 8px', fontWeight: 700, fontSize: 11, color: '#1A3A6B', cursor: 'pointer', textAlign: 'left', backdropFilter: 'blur(4px)' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Última frase */}
        {historico.length > 0 && (
          <div style={{ fontSize: 10, color: '#7A9EB8', fontWeight: 600, lineHeight: 1.4 }}>
            Última: "{historico[0]}"
          </div>
        )}
      </div>

      {/* ── PAINEL DIREITO: abas + grade completa ─────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: 3, gap: 2, backdropFilter: 'blur(6px)', flexShrink: 0 }}>
          {FASE3_ABAS.map((aba) => (
            <button
              key={aba.id}
              onPointerDown={() => setAbaAtiva(aba.id)}
              style={{ flex: 1, padding: '6px 2px', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 10, background: abaAtiva === aba.id ? 'white' : 'transparent', color: abaAtiva === aba.id ? '#1A3A6B' : '#7A9EB8', boxShadow: abaAtiva === aba.id ? '0 1px 6px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
            >
              {aba.label}
            </button>
          ))}
        </div>

        {/* Grade de símbolos — sem maxHeight, todos visíveis */}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7, alignContent: 'start' }}>
          {abaAtual.simbolos.map((id) => (
            <MiniSymbol key={id} id={id} onPress={adicionarSimbolo} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0.7); opacity: 0; }
          70%  { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
