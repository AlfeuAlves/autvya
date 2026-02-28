import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useSound } from '../hooks/useSound.js';
import AuTvyaLogo from '../components/AuTvyaLogo.jsx';
import RobotMascot from '../components/RobotMascot.jsx';
import Phase1Conexao from './phases/Phase1Conexao.jsx';
import Phase2Escolha from './phases/Phase2Escolha.jsx';
import Phase3Comunicacao from './phases/Phase3Comunicacao.jsx';
import { checkReadiness } from '../data/vocabulary.js';

const FASE_LABELS = {
  CONEXAO:     { label: 'Conexão',     emoji: '🌱', cor: '#4A90D9' },
  ESCOLHA:     { label: 'Escolha',     emoji: '⭐', cor: '#FF9800' },
  COMUNICACAO: { label: 'Comunicação', emoji: '🚀', cor: '#4CAF50' },
};

function Cloud({ style }) {
  return (
    <div style={{ position: 'absolute', ...style, pointerEvents: 'none' }}>
      <div style={{ position: 'relative', width: 88, height: 34 }}>
        <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 52, height: 32, bottom: 0, left: 0, opacity: 0.85 }} />
        <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 44, height: 28, bottom: 0, left: 26, opacity: 0.85 }} />
        <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 34, height: 34, bottom: 5, left: 15, opacity: 0.85 }} />
      </div>
    </div>
  );
}

export default function ChildInterface() {
  const { id: criancaId } = useParams();
  const navigate = useNavigate();
  const { speak } = useSound();

  const [crianca, setCrianca] = useState(null);
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [robotWaving, setRobotWaving] = useState(false);
  const [showReadiness, setShowReadiness] = useState(false);

  const [sessaoInicio] = useState(Date.now());
  const [interacoesBuffer, setInteracoesBuffer] = useState([]);
  const syncTimer = useRef(null);

  useEffect(() => {
    loadCrianca();
    return () => {
      clearInterval(syncTimer.current);
      syncInteracoes();
    };
  }, [criancaId]);

  // Sync automático a cada 30s
  useEffect(() => {
    syncTimer.current = setInterval(syncInteracoes, 30000);
    return () => clearInterval(syncTimer.current);
  }, [interacoesBuffer]);

  async function loadCrianca() {
    try {
      const [criancaRes, metRes] = await Promise.all([
        api.get(`/children/${criancaId}`),
        api.get(`/interactions/${criancaId}/metrics?dias=30`).catch(() => ({ data: { metricas: null } })),
      ]);
      setCrianca(criancaRes.data.crianca);
      setMetricas(metRes.data.metricas);
      // Verificar prontidão para avançar de fase
      if (metRes.data.metricas && criancaRes.data.crianca.fase !== 'COMUNICACAO') {
        setShowReadiness(checkReadiness(criancaRes.data.crianca.fase, metRes.data.metricas));
      }
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  const syncInteracoes = useCallback(async () => {
    if (interacoesBuffer.length === 0) return;
    const buffer = [...interacoesBuffer];
    setInteracoesBuffer([]);
    try {
      await api.post('/interactions/lote', { criancaId, interacoes: buffer });
    } catch (err) {
      console.error('Sync error:', err);
    }
  }, [interacoesBuffer, criancaId]);

  // Chamado por qualquer fase quando a criança interage
  function handleInteracao(botaoId, extras = {}) {
    const sym = botaoId.startsWith('frase:') ? botaoId : botaoId;
    speak(botaoId);
    setRobotWaving(true);
    setTimeout(() => setRobotWaving(false), 800);

    const duracaoSessao = Math.round((Date.now() - sessaoInicio) / 1000);
    setInteracoesBuffer((prev) => [
      ...prev,
      { botao: botaoId, timestamp: new Date().toISOString(), duracaoSessao },
    ]);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #6EC4E8 0%, #BDE5F5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!crianca) return null;

  const faseInfo = FASE_LABELS[crianca.fase];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #6EC4E8 0%, #93D3EF 22%, #BDE5F5 50%, #DFF2FB 72%, #EFF8FD 100%)',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 86,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Nuvens */}
      <Cloud style={{ left: '-6px', top: '12px' }} />
      <Cloud style={{ right: '8px', top: '6px', transform: 'scale(0.8)' }} />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 8px', position: 'relative', zIndex: 10 }}>
        <button
          onClick={() => { syncInteracoes(); navigate('/dashboard'); }}
          style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.72)', border: 'none', borderRadius: 12, fontSize: 18, cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ←
        </button>

        <div style={{ textAlign: 'center' }}>
          <AuTvyaLogo size="sm" />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${faseInfo.cor}22`, border: `1.5px solid ${faseInfo.cor}55`, borderRadius: 20, padding: '2px 10px', marginTop: 3 }}>
            <span style={{ fontSize: 12 }}>{faseInfo.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: faseInfo.cor }}>{faseInfo.label}</span>
          </div>
        </div>

        <div style={{ width: 40, height: 40, background: 'rgba(255,248,220,0.9)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
          ⭐
        </div>
      </header>

      {/* ── Banner de prontidão para pais ───────────────────────────── */}
      {showReadiness && (
        <div style={{ margin: '0 16px 8px', background: 'rgba(76,175,80,0.15)', border: '1.5px solid #4CAF5088', borderRadius: 16, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 5 }}>
          <span style={{ fontSize: 20 }}>🎯</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: '#1A3A6B' }}>
              {crianca.nome} pode estar pronta para a próxima fase!
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#4CAF50', fontWeight: 600 }}>
              Consulte um profissional para avaliar o avanço.
            </p>
          </div>
          <button onClick={() => setShowReadiness(false)} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#7A9EB8' }}>×</button>
        </div>
      )}

      {/* ── Fase ativa ──────────────────────────────────────────────── */}
      {crianca.fase === 'CONEXAO' && (
        <Phase1Conexao onInteracao={handleInteracao} />
      )}
      {crianca.fase === 'ESCOLHA' && (
        <Phase2Escolha onInteracao={handleInteracao} />
      )}
      {crianca.fase === 'COMUNICACAO' && (
        <Phase3Comunicacao onInteracao={handleInteracao} speak={speak} />
      )}

      {/* ── Rodapé: grama + mascote + estrela ───────────────────────── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 82, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(180deg, #7BC745 0%, #5DA828 100%)', borderRadius: '50% 50% 0 0 / 18px 18px 0 0' }} />
        <div style={{ position: 'absolute', bottom: 10, left: 18, pointerEvents: 'none' }}>
          <RobotMascot size={60} waving={robotWaving} />
        </div>
        <div style={{ position: 'absolute', bottom: 20, right: 22, fontSize: 26, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))' }}>⭐</div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
