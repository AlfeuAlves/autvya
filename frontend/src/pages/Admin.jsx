import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const FASE_LABEL = {
  CONEXAO:     { label: 'Conexão',     cor: '#4F7FFF', bg: '#EBF4FF' },
  ESCOLHA:     { label: 'Escolha',     cor: '#FF9800', bg: '#FFF7ED' },
  COMUNICACAO: { label: 'Comunicação', cor: '#4CAF50', bg: '#F0FDF4' },
};

function StatCard({ icon, value, label, cor = '#4F7FFF' }) {
  return (
    <div style={{
      background: 'white', borderRadius: '1rem', padding: '20px 24px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14, fontSize: '1.5rem',
        background: `${cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [expandido, setExpandido] = useState({});

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      setDados(data);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate('/dashboard');
      } else {
        setErro('Erro ao carregar dados.');
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleExpandir(id) {
    setExpandido((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const usuariosFiltrados = dados?.usuarios?.filter((u) =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) ||
    u.email.toLowerCase().includes(busca.toLowerCase())
  ) ?? [];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #4F7FFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#EF4444' }}>{erro}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)', padding: '28px 20px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: '1.4rem' }}>🛡️</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white', margin: 0 }}>
              Painel Administrativo
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            Visão geral de todos os usuários e crianças cadastradas
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>

        {/* Cards de resumo */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard icon="👨‍👩‍👧" value={dados?.resumo?.totalUsuarios ?? 0}   label="Usuários cadastrados" cor="#4F7FFF" />
          <StatCard icon="👶"       value={dados?.resumo?.totalCriancas ?? 0}   label="Crianças cadastradas"  cor="#A6E3A1" />
          <StatCard icon="👆"       value={dados?.resumo?.totalInteracoes ?? 0} label="Interações totais"      cor="#FFD166" />
        </div>

        {/* Barra de busca + botão atualizar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍  Buscar por nome ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              flex: 1, minWidth: 220,
              padding: '10px 14px', borderRadius: '0.75rem',
              border: '1.5px solid #E2E8F0', background: 'white',
              fontSize: '0.9rem', outline: 'none',
            }}
          />
          <button
            onClick={carregar}
            style={{
              padding: '10px 18px', borderRadius: '0.75rem',
              background: '#4F7FFF', color: 'white', border: 'none',
              fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
            }}
          >
            ↻ Atualizar
          </button>
        </div>

        {/* Lista de usuários */}
        {usuariosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#94A3B8' }}>
            {busca ? 'Nenhum usuário encontrado.' : 'Nenhum usuário cadastrado ainda.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {usuariosFiltrados.map((usuario) => (
              <div key={usuario.id} style={{
                background: 'white', borderRadius: '1rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                border: '1px solid #F1F5F9', overflow: 'hidden',
              }}>
                {/* Linha do usuário */}
                <button
                  onClick={() => toggleExpandir(usuario.id)}
                  style={{
                    width: '100%', padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #4F7FFF, #6366F1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', color: 'white', fontWeight: 800,
                  }}>
                    {usuario.nome.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginBottom: 2 }}>
                      {usuario.nome}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {usuario.email}
                    </div>
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>cadastro</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                        {new Date(usuario.criadoEm).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div style={{
                      background: '#F1F5F9', borderRadius: 8, padding: '4px 10px',
                      fontSize: '0.78rem', fontWeight: 700, color: '#475569',
                    }}>
                      {usuario.filhos.length} {usuario.filhos.length === 1 ? 'criança' : 'crianças'}
                    </div>
                    <span style={{ fontSize: '1rem', color: '#94A3B8', transition: 'transform 0.2s', transform: expandido[usuario.id] ? 'rotate(180deg)' : 'none' }}>
                      ▾
                    </span>
                  </div>
                </button>

                {/* Filhos expandidos */}
                {expandido[usuario.id] && (
                  <div style={{ borderTop: '1px solid #F1F5F9', padding: '12px 20px 16px' }}>
                    {usuario.filhos.length === 0 ? (
                      <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0 }}>
                        Nenhuma criança cadastrada ainda.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {usuario.filhos.map((filho) => {
                          const faseInfo = FASE_LABEL[filho.fase];
                          return (
                            <div key={filho.id} style={{
                              display: 'flex', alignItems: 'center', gap: 12,
                              background: '#F8FAFC', borderRadius: '0.75rem', padding: '10px 14px',
                            }}>
                              <span style={{ fontSize: '1.3rem' }}>👶</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                  {filho.nome}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                  {filho.idade} anos · cadastro {new Date(filho.criadoEm).toLocaleDateString('pt-BR')}
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{
                                  background: faseInfo.bg, color: faseInfo.cor,
                                  borderRadius: 8, padding: '3px 10px',
                                  fontSize: '0.72rem', fontWeight: 800,
                                }}>
                                  {faseInfo.label}
                                </span>
                                <span style={{
                                  background: '#FFF7ED', color: '#FF9800',
                                  borderRadius: 8, padding: '3px 10px',
                                  fontSize: '0.72rem', fontWeight: 700,
                                }}>
                                  {filho._count.interacoes} toques
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
