import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import AuTvyaLogo from '../components/AuTvyaLogo.jsx';
import RobotMascot from '../components/RobotMascot.jsx';
import { SYMBOLS } from '../data/vocabulary.js';
import { useAuth } from '../context/AuthContext.jsx';

const FASE_INFO = {
  CONEXAO:     { label: 'Conexão',     index: 0 },
  ESCOLHA:     { label: 'Escolha',     index: 1 },
  COMUNICACAO: { label: 'Comunicação', index: 2 },
};

function PhaseProgressBar({ fase }) {
  const phases = ['CONEXAO', 'ESCOLHA', 'COMUNICACAO'];
  const labels = ['Conexão', 'Escolha', 'Comunicação'];
  const current = FASE_INFO[fase]?.index ?? 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
      {/* Barra de progresso */}
      <div style={{ flex: 1, height: 14, background: '#E0EEF8', borderRadius: 10, overflow: 'hidden', display: 'flex' }}>
        <div style={{
          width: current === 0 ? '33%' : current === 1 ? '66%' : '100%',
          background: 'linear-gradient(90deg, #5FC050 0%, #A8DC50 60%, #B8E870 100%)',
          borderRadius: 10,
          transition: 'width 0.6s ease',
          position: 'relative',
        }}>
          {/* Divisor azul claro */}
          {current >= 1 && (
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 4, background: 'rgba(100,180,255,0.5)' }} />
          )}
        </div>
        {current >= 1 && (
          <div style={{ flex: 1, background: 'linear-gradient(90deg, #B0D8FF 0%, #7FBBFF 100%)' }} />
        )}
      </div>

      {/* Indicadores de fase */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {phases.map((p, i) => {
          const done = i < current;
          const active = i === current;
          const locked = i > current;
          return (
            <span key={p} style={{
              fontSize: 11,
              fontWeight: active ? 800 : 600,
              color: active ? '#3A8A28' : done ? '#3A8A28' : '#9BB8D0',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}>
              {done ? '✓' : locked ? '🔒' : ''}
              {labels[i]}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, bg, iconBg }) {
  return (
    <div style={{ background: bg, borderRadius: 18, padding: '12px 14px', flex: 1, minWidth: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ width: 32, height: 32, background: iconBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ fontSize: 11, color: '#6B8DA8', fontWeight: 600, lineHeight: 1.2 }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color: '#1A3A6B', lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function ActivityRow({ botao, timestamp }) {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const sym = SYMBOLS[botao];
  const emoji = sym?.icon || '❓';
  const label = sym?.label || botao;
  const rowBg = sym ? `${sym.bg}44` : '#F5F7FA';

  return (
    <div style={{ display: 'flex', alignItems: 'center', background: rowBg, borderRadius: 14, padding: '10px 14px', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', flexShrink: 0 }}>
        {emoji}
      </div>
      <span style={{ flex: 1, fontWeight: 700, fontSize: 15, color: '#1A3A6B' }}>{label}</span>
      <span style={{ fontSize: 13, color: '#7A9EB8', fontWeight: 500 }}>{time}</span>
      <span style={{ fontSize: 14, color: '#AAC8DE' }}>›</span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fotoUrl, setFotoUrl] = useState(null);
  const [filhos, setFilhos] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [metricas, setMetricas] = useState(null);
  const [toquesHoje, setToquesHoje] = useState(0);
  const [interacoesHoje, setInteracoesHoje] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressoAberto, setProgressoAberto] = useState(true);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { if (selectedChild) loadMetricas(selectedChild); }, [selectedChild]);
  useEffect(() => {
    setFotoUrl(localStorage.getItem('autvya_foto_perfil') || null);
  }, []);

  async function loadData() {
    try {
      const { data } = await api.get('/children');
      setFilhos(data.filhos);
      if (data.filhos.length > 0) setSelectedChild(data.filhos[0].id);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function loadMetricas(id) {
    try {
      // Pequeno delay para garantir que o sync da sessão anterior completou
      await new Promise((r) => setTimeout(r, 600));
      const [metRes, metHojeRes, repRes] = await Promise.all([
        api.get(`/interactions/${id}/metrics?dias=30`),
        api.get(`/interactions/${id}/metrics?dias=1`),
        api.get(`/reports/${id}?dias=1`),
      ]);
      setMetricas(metRes.data.metricas);
      setToquesHoje(metHojeRes.data.metricas?.totalInteracoes ?? 0);
      setInteracoesHoje((repRes.data.interacoesRecentes || []).slice(0, 6));
    } catch (err) { console.error(err); }
  }

  const crianca = filhos.find((f) => f.id === selectedChild);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #6EC4E8 0%, #BDE5F5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 44, height: 44, border: '4px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #6EC4E8 0%, #93D3EF 22%, #BDE5F5 50%, #DFF2FB 72%, #F5FBFF 100%)',
      position: 'relative',
      overflow: 'hidden',
      paddingBottom: 100,
    }}>
      {/* Nuvens decorativas */}
      <div style={{ position: 'absolute', left: -10, top: 16, opacity: 0.8 }}>
        <div style={{ position: 'relative', width: 100, height: 40 }}>
          <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 60, height: 38, bottom: 0, left: 0 }} />
          <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 50, height: 32, bottom: 0, left: 28 }} />
          <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 36, height: 36, bottom: 6, left: 16 }} />
        </div>
      </div>
      <div style={{ position: 'absolute', right: 8, top: 10, opacity: 0.7, transform: 'scale(0.85)' }}>
        <div style={{ position: 'relative', width: 100, height: 40 }}>
          <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 60, height: 38, bottom: 0, left: 0 }} />
          <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 50, height: 32, bottom: 0, left: 28 }} />
          <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 36, height: 36, bottom: 6, left: 16 }} />
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px', position: 'relative' }}>
        {/* Logo centralizada */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <AuTvyaLogo height={62} />
        </div>
        {/* Espaçador para equilibrar os botões da direita */}
        <div style={{ width: 88 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/sobre" style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.75)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, backdropFilter: 'blur(6px)', textDecoration: 'none' }}>
            🧠
          </Link>
        <Link to="/configuracoes" style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.75)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, backdropFilter: 'blur(6px)', textDecoration: 'none' }}>
          ⚙️
        </Link>
        </div>
      </div>

      <div style={{ padding: '0 16px', maxWidth: 420, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Seletor de criança (múltiplas) */}
        {filhos.length > 1 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {filhos.map((f) => (
              <button key={f.id} onClick={() => setSelectedChild(f.id)} style={{
                flexShrink: 0, padding: '6px 16px', borderRadius: 20, border: '2px solid',
                borderColor: selectedChild === f.id ? '#4A90D9' : 'rgba(255,255,255,0.6)',
                background: selectedChild === f.id ? '#4A90D9' : 'rgba(255,255,255,0.7)',
                color: selectedChild === f.id ? 'white' : '#1A3A6B',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', backdropFilter: 'blur(6px)',
              }}>
                {f.nome.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filhos.length === 0 && (
          <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 24, padding: '40px 24px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>👶</div>
            <p style={{ fontWeight: 800, fontSize: 18, color: '#1A3A6B', marginBottom: 8 }}>Cadastre o primeiro perfil</p>
            <p style={{ color: '#6B8DA8', fontSize: 14, marginBottom: 20 }}>Crie um perfil para sua criança e comece a usar a plataforma.</p>
            <Link to="/criancas/nova" style={{ display: 'inline-block', background: '#4A90D9', color: 'white', borderRadius: 14, padding: '12px 28px', fontWeight: 800, textDecoration: 'none' }}>
              Criar perfil
            </Link>
          </div>
        )}

        {crianca && (
          <>
            {/* Card de perfil */}
            <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: '16px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, #A8E063, #56CCF2)', border: '3px solid white', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 3px 10px rgba(0,0,0,0.12)' }}>
                    {fotoUrl
                      ? <img src={fotoUrl} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : crianca.nome[0].toUpperCase()
                    }
                  </div>
                  {/* Seta de trocar */}
                  <div style={{ position: 'absolute', bottom: 0, right: -4, width: 22, height: 22, background: '#4A90D9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white', border: '2px solid white' }}>
                    ↔
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontWeight: 900, fontSize: 20, color: '#1A3A6B' }}>{crianca.nome.split(' ')[0]}</span>
                    <span style={{ fontSize: 16 }}>🇧🇷</span>
                    <span style={{ fontSize: 13, color: '#7A9EB8', fontWeight: 600 }}>{crianca.idade} anos</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#9BB8D0', fontWeight: 500, marginBottom: 2 }}>Fase</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#3A7BC8' }}>{FASE_INFO[crianca.fase]?.label}</div>
                </div>

                {/* Botão editar */}
                <Link to={`/criancas/${crianca.id}/editar`} style={{ width: 38, height: 38, background: '#EEF5FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: 16, color: '#4A90D9', flexShrink: 0 }}>
                  ✏️
                </Link>
              </div>

              {/* Barra de fases com mascote */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flexShrink: 0, marginBottom: -4 }}>
                  <RobotMascot size={42} />
                </div>
                <div style={{ flex: 1 }}>
                  <PhaseProgressBar fase={crianca.fase} />
                </div>
              </div>
            </div>

            {/* Cards de métricas */}
            {metricas && (
              <div style={{ display: 'flex', gap: 10 }}>
                <MetricCard
                  icon="📅"
                  label="Dias Ativos"
                  value={metricas.diasAtivos}
                  bg="rgba(235,244,255,0.95)"
                  iconBg="#D0E8FF"
                />
                <MetricCard
                  icon="✅"
                  label="Toques Hoje"
                  value={toquesHoje}
                  bg="rgba(235,255,240,0.95)"
                  iconBg="#C0F0CC"
                />
                <MetricCard
                  icon={SYMBOLS[metricas.botaoFavorito]?.icon || '⭐'}
                  label="Favorito"
                  value={SYMBOLS[metricas.botaoFavorito]?.label || 'N/A'}
                  bg="rgba(255,248,225,0.95)"
                  iconBg="#FFE680"
                />
              </div>
            )}

            {/* Botão Iniciar sessão */}
            <button
              onClick={() => navigate(`/crianca/${crianca.id}`)}
              style={{ width: '100%', background: 'linear-gradient(135deg, #FFD700, #FF9500)', color: '#7A3800', border: 'none', borderRadius: 24, padding: '20px 0', fontWeight: 900, fontSize: 22, cursor: 'pointer', boxShadow: '0 7px 0 #B86A00, 0 12px 28px rgba(255,149,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'transform 0.1s, box-shadow 0.1s', letterSpacing: '0.02em' }}
              onPointerDown={(e) => { e.currentTarget.style.transform = 'translateY(5px)'; e.currentTarget.style.boxShadow = '0 2px 0 #B86A00'; }}
              onPointerUp={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 7px 0 #B86A00, 0 12px 28px rgba(255,149,0,0.35)'; }}
              onPointerLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 7px 0 #B86A00, 0 12px 28px rgba(255,149,0,0.35)'; }}
            >
              <span style={{ fontSize: 28 }}>🚀</span>
              Vamos lá!
            </button>

            {/* Progresso Hoje */}
            <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', backdropFilter: 'blur(8px)' }}>
              <button
                onClick={() => setProgressoAberto((v) => !v)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <div style={{ width: 32, height: 32, background: '#E8F8E8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🕐</div>
                <span style={{ flex: 1, textAlign: 'left', fontWeight: 800, fontSize: 16, color: '#1A3A6B' }}>Progresso Hoje</span>
                <span style={{ fontSize: 18, color: '#7A9EB8', transform: progressoAberto ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>⌄</span>
              </button>

              {progressoAberto && (
                <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {interacoesHoje.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#9BB8D0', fontSize: 14 }}>
                      Nenhuma interação hoje ainda
                    </div>
                  ) : (
                    interacoesHoje.map((i) => (
                      <ActivityRow key={i.id} botao={i.botao} timestamp={i.timestamp} />
                    ))
                  )}
                  <Link to={`/relatorios/${crianca.id}`} style={{ textAlign: 'center', color: '#4A90D9', fontWeight: 700, fontSize: 13, marginTop: 4, textDecoration: 'none' }}>
                    Ver relatório completo →
                  </Link>
                </div>
              )}
            </div>

            {/* Nova criança */}
            <div style={{ textAlign: 'center', paddingBottom: 8 }}>
              <Link to="/criancas/nova" style={{ color: 'rgba(26,58,107,0.6)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                + Adicionar outra criança
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Grama no rodapé */}
      <div style={{ position: 'fixed', bottom: 56, left: 0, right: 0, height: 55, background: 'linear-gradient(180deg, #7BC745 0%, #5DA828 100%)', borderRadius: '50% 50% 0 0 / 18px 18px 0 0', zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', lineHeight: 1.3, marginTop: -8 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em' }}>
            Alfeu Smart Solution
          </p>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
            (91) 98359-4825
          </p>
        </div>
      </div>

      {/* Mascote no canto */}
      <div style={{ position: 'fixed', bottom: 64, left: 14, zIndex: 1 }}>
        <RobotMascot size={52} />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
