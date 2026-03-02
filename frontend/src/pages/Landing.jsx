import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ── Dados ─────────────────────────────────────────────────────────────────

const FASE1_PICS = [
  { icon: '💧', label: 'Água',     bg: '#3FA9F5' },
  { icon: '🍎', label: 'Comer',    bg: '#F05A30' },
  { icon: '🎈', label: 'Brincar',  bg: '#6DC420' },
  { icon: '➕', label: 'Mais',     bg: '#9468CC' },
  { icon: '😴', label: 'Dormir',   bg: '#20B8B2' },
  { icon: '🚫', label: 'Não',      bg: '#E83535' },
  { icon: '✅', label: 'Sim',      bg: '#66BB6A' },
  { icon: '🙏', label: 'Ajuda',    bg: '#FF7043' },
  { icon: '🚽', label: 'Banheiro', bg: '#5C6BC0' },
  { icon: '🤕', label: 'Dói',      bg: '#EF9A9A' },
  { icon: '😄', label: 'Feliz',    bg: '#FFD54F' },
  { icon: '😢', label: 'Triste',   bg: '#78909C' },
  { icon: '✋', label: 'Parar',    bg: '#FF5722' },
  { icon: '👋', label: 'Oi',       bg: '#FFD700' },
  { icon: '🤲', label: 'Quero',    bg: '#42A5F5' },
  { icon: '🏁', label: 'Acabou',   bg: '#A5D6A7' },
];

const CATEGORIAS_SLIDE = [
  { icon: '💧', label: 'Bebidas',  bg: '#3FA9F5' },
  { icon: '🍎', label: 'Comidas',  bg: '#F05A30' },
  { icon: '🎈', label: 'Brincar',  bg: '#6DC420' },
  { icon: '😴', label: 'Descanso', bg: '#20B8B2' },
];

const PROGRESS_DATA = [
  { label: 'Símbolos',  pct: 75, color: '#4F7FFF' },
  { label: 'Dias',      pct: 60, color: '#A6E3A1' },
  { label: 'Sessões',   pct: 40, color: '#FFD166' },
  { label: 'Meta',      pct: 85, color: '#FF9800' },
];

const COMO_FUNCIONA = [
  { num: '1', icon: '📋', title: 'Crie sua conta grátis',   desc: 'Cadastro simples e seguro em menos de 2 minutos.'                },
  { num: '2', icon: '👶', title: 'Configure o perfil',       desc: 'Personalize a interface para a idade e fase da criança.'         },
  { num: '3', icon: '💬', title: 'Inicie a comunicação',     desc: 'A criança toca os pictogramas e o app fala em voz alta.'        },
  { num: '4', icon: '📊', title: 'Acompanhe com IA',         desc: 'Relatórios inteligentes e recomendações personalizadas.'         },
];

const FASES = [
  {
    emoji: '🌱',
    title: 'Fase 1 — Conexão',
    desc: '16 pictogramas para necessidades básicas. A criança aprende que tocar = comunicar.',
    bg: 'linear-gradient(135deg, #EBF4FF, #DBEAFE)',
    border: '#93C5FD',
    color: '#1D4ED8',
  },
  {
    emoji: '🎯',
    title: 'Fase 2 — Escolha',
    desc: 'Categorias e contextos do dia a dia. Discriminação e escolhas significativas.',
    bg: 'linear-gradient(135deg, #FFF7ED, #FED7AA)',
    border: '#FB923C',
    color: '#C2410C',
  },
  {
    emoji: '💬',
    title: 'Fase 3 — Comunicação',
    desc: 'Frases completas com combinação de pictogramas. Comunicação rica e funcional.',
    bg: 'linear-gradient(135deg, #F0FDF4, #BBF7D0)',
    border: '#4ADE80',
    color: '#15803D',
  },
];

// ── Mockups do carrossel ──────────────────────────────────────────────────

function TabletMockup() {
  return (
    <div style={{
      width: 300, height: 220,
      background: '#1A1A2E',
      borderRadius: 14,
      padding: '8px 10px 12px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 2px #2d2d2d',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
        <div style={{ width: 7, height: 7, background: '#444', borderRadius: '50%' }} />
      </div>
      <div style={{
        background: 'linear-gradient(180deg, #6EC4E8 0%, #BDE5F5 100%)',
        borderRadius: 8,
        padding: 6,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 4,
        height: 'calc(100% - 18px)',
      }}>
        {FASE1_PICS.map((p) => (
          <div key={p.label} style={{
            background: p.bg,
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            padding: '2px 1px',
          }}>
            <span style={{ fontSize: '0.78rem', lineHeight: 1 }}>{p.icon}</span>
            <span style={{ fontSize: '0.27rem', color: 'white', fontWeight: 800, letterSpacing: '0.02em', textAlign: 'center' }}>
              {p.label.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneMockupFase2() {
  return (
    <div style={{
      width: 158, height: 288,
      background: '#1A1A2E',
      borderRadius: 26,
      padding: '10px 6px 14px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 2px #2d2d2d',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
        <div style={{ width: 36, height: 4, background: '#444', borderRadius: 2 }} />
      </div>
      <div style={{
        background: 'linear-gradient(180deg, #6EC4E8 0%, #BDE5F5 100%)',
        borderRadius: 18,
        padding: '8px 6px',
        height: 'calc(100% - 16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
      }}>
        <div style={{ textAlign: 'center', fontSize: '0.52rem', fontWeight: 700, color: '#1A3A6B' }}>
          O que você quer? 🤔
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, flex: 1 }}>
          {CATEGORIAS_SLIDE.map((c) => (
            <div key={c.label} style={{
              background: c.bg,
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              boxShadow: `0 3px 0 ${c.bg}AA`,
            }}>
              <span style={{ fontSize: '1.25rem' }}>{c.icon}</span>
              <span style={{ fontSize: '0.42rem', color: 'white', fontWeight: 800, letterSpacing: '0.04em' }}>
                {c.label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhoneMockupDashboard() {
  return (
    <div style={{
      width: 158, height: 288,
      background: '#1A1A2E',
      borderRadius: 26,
      padding: '10px 6px 14px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 2px #2d2d2d',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
        <div style={{ width: 36, height: 4, background: '#444', borderRadius: 2 }} />
      </div>
      <div style={{
        background: '#F5F7FA',
        borderRadius: 18,
        padding: '8px 7px',
        height: 'calc(100% - 16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        overflow: 'hidden',
      }}>
        <div style={{ textAlign: 'center', fontSize: '0.52rem', fontWeight: 800, color: '#1A1A2E' }}>
          📊 Dashboard
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
          {[
            { icon: '📅', v: '7',    u: 'dias'     },
            { icon: '👆', v: '42',   u: 'toques'   },
            { icon: '💧', v: 'Água', u: 'favorito' },
            { icon: '⏱️', v: '8m',   u: 'sessão'   },
          ].map((m) => (
            <div key={m.u} style={{ background: 'white', borderRadius: 6, padding: '4px 2px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: '0.68rem' }}>{m.icon}</div>
              <div style={{ fontSize: '0.48rem', fontWeight: 800, color: '#1A1A2E' }}>{m.v}</div>
              <div style={{ fontSize: '0.34rem', color: '#9CA3AF' }}>{m.u}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {PROGRESS_DATA.map((b) => (
            <div key={b.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: '0.37rem', color: '#6B7280' }}>{b.label}</span>
                <span style={{ fontSize: '0.37rem', fontWeight: 700, color: b.color }}>{b.pct}%</span>
              </div>
              <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2 }}>
                <div style={{ width: `${b.pct}%`, height: '100%', background: b.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Carrossel ─────────────────────────────────────────────────────────────

const SLIDE_DEFS = [
  { Component: TabletMockup,         caption: '16 pictogramas essenciais', phase: '🌱 Fase 1 — Conexão' },
  { Component: PhoneMockupFase2,     caption: 'Categorias contextuais',    phase: '🎯 Fase 2 — Escolha' },
  { Component: PhoneMockupDashboard, caption: 'Relatórios e progresso',    phase: '📊 Dashboard'        },
];

function Carousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  function startTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % SLIDE_DEFS.length), 4000);
  }

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, []);

  function goTo(i) { setCurrent(i); startTimer(); }

  const arrowStyle = {
    position: 'absolute', top: '44%', transform: 'translateY(-50%)',
    width: 34, height: 34,
    background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%',
    cursor: 'pointer', fontSize: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10, color: '#1A1A2E', fontWeight: 700,
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <div style={{ overflow: 'hidden', borderRadius: 20 }}>
        <div style={{ display: 'flex', transform: `translateX(-${current * 100}%)`, transition: 'transform 0.5s ease-in-out' }}>
          {SLIDE_DEFS.map(({ Component, caption, phase }, i) => (
            <div key={i} style={{
              minWidth: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
              padding: '32px 20px 24px',
              background: 'linear-gradient(135deg, #EBF4FF 0%, #ffffff 50%, #F0FDF4 100%)',
              borderRadius: 20, border: '1.5px solid #E2E8F0',
            }}>
              <Component />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4F7FFF', marginBottom: 4 }}>{phase}</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1A1A2E' }}>{caption}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => goTo((current - 1 + SLIDE_DEFS.length) % SLIDE_DEFS.length)} style={{ ...arrowStyle, left: -15 }}>‹</button>
      <button onClick={() => goTo((current + 1) % SLIDE_DEFS.length)} style={{ ...arrowStyle, right: -15 }}>›</button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
        {SLIDE_DEFS.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === current ? 24 : 8, height: 8, borderRadius: 4,
            background: i === current ? '#4F7FFF' : '#CBD5E1',
            border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }

  const navBtn = {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '0.93rem', fontWeight: 600, color: '#374151', padding: '4px 0',
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <img src="/logoaltvya.png" alt="AUTVYA" style={{ height: 40, objectFit: 'contain', flexShrink: 0 }} />

        <div className="lp-desktop-nav" style={{ display: 'flex', gap: 28, flex: 1, justifyContent: 'center' }}>
          <button onClick={() => scrollTo('app-preview')} style={navBtn}>Ver o app</button>
          <button onClick={() => scrollTo('como-funciona')} style={navBtn}>Como funciona</button>
          <button onClick={() => scrollTo('fases')} style={navBtn}>As 3 fases</button>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
          <Link to="/login" className="lp-desktop-nav" style={{
            fontSize: '0.88rem', fontWeight: 700, color: '#4F7FFF', textDecoration: 'none',
            padding: '8px 18px', border: '2px solid #4F7FFF', borderRadius: '0.75rem', whiteSpace: 'nowrap',
          }}>
            Entrar
          </Link>
          <Link to="/registro" style={{
            fontSize: '0.88rem', fontWeight: 700, color: 'white', textDecoration: 'none',
            padding: '8px 18px', background: '#4F7FFF', borderRadius: '0.75rem',
            boxShadow: '0 2px 10px #4F7FFF44', whiteSpace: 'nowrap',
          }}>
            Cadastrar grátis
          </Link>
          <button className="lp-hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" style={{
            background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#374151', padding: '4px 6px',
          }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{
          background: 'white', borderTop: '1px solid rgba(0,0,0,0.07)',
          padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <button onClick={() => scrollTo('app-preview')} style={{ ...navBtn, textAlign: 'left', fontSize: '1rem' }}>Ver o app</button>
          <button onClick={() => scrollTo('como-funciona')} style={{ ...navBtn, textAlign: 'left', fontSize: '1rem' }}>Como funciona</button>
          <button onClick={() => scrollTo('fases')} style={{ ...navBtn, textAlign: 'left', fontSize: '1rem' }}>As 3 fases</button>
          <Link to="/login" style={{ textDecoration: 'none', color: '#4F7FFF', fontWeight: 700, fontSize: '1rem' }} onClick={() => setMenuOpen(false)}>Entrar</Link>
          <Link to="/registro" style={{ textDecoration: 'none', color: '#4F7FFF', fontWeight: 800, fontSize: '1rem' }} onClick={() => setMenuOpen(false)}>Cadastrar grátis →</Link>
        </div>
      )}
    </nav>
  );
}

// ── Componente principal ──────────────────────────────────────────────────

export default function Landing() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1A1A2E', overflowX: 'hidden' }}>
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════
          HERO — imagem emocional em destaque
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(160deg, #EBF4FF 0%, #f7fbff 40%, #F0FDF4 100%)',
        padding: '56px 20px 72px',
      }}>
        <div className="lp-hero-grid" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 52, alignItems: 'center',
        }}>

          {/* ── Coluna de texto (desktop: esquerda / mobile: abaixo) ── */}
          <div className="lp-hero-text">
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#EBF4FF', border: '1px solid #93C5FD', borderRadius: 20,
              padding: '5px 14px', marginBottom: 24,
              fontSize: '0.78rem', fontWeight: 700, color: '#1D4ED8',
            }}>
              💙 CAA — Comunicação Aumentativa e Alternativa
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2rem, 4.2vw, 3.1rem)', fontWeight: 900, lineHeight: 1.18,
              color: '#0F172A', margin: '0 0 18px',
            }}>
              Cada toque no tablet<br />
              é uma palavra de<br />
              <span style={{ color: '#4F7FFF' }}>amor que ele diz</span>
            </h1>

            {/* Subtítulo */}
            <p style={{
              fontSize: '1.08rem', color: '#475569', lineHeight: 1.75,
              margin: '0 0 10px', maxWidth: 460,
            }}>
              O AUTVYA dá voz às crianças neurodiversas através de pictogramas
              interativos — para que pais e filhos se entendam, todo dia.
            </p>

            {/* Detalhes suaves */}
            <p style={{
              fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6,
              margin: '0 0 34px', maxWidth: 420,
            }}>
              Metodologia PECS · Voz em PT-BR · Relatórios com IA · Funciona offline
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
              <Link to="/registro" style={{
                background: '#4F7FFF', color: 'white', textDecoration: 'none',
                padding: '15px 30px', borderRadius: '1rem', fontWeight: 800, fontSize: '1rem',
                boxShadow: '0 6px 20px #4F7FFF40', display: 'inline-block',
              }}>
                Começar grátis →
              </Link>
              <Link to="/login" style={{
                background: 'white', color: '#374151', textDecoration: 'none',
                padding: '15px 28px', borderRadius: '1rem', fontWeight: 700, fontSize: '1rem',
                border: '2px solid #E2E8F0', display: 'inline-block',
              }}>
                Já tenho conta
              </Link>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { icon: '🔒', text: '100% seguro e privado' },
                { icon: '🆓', text: 'Gratuito para começar' },
                { icon: '❤️', text: 'Feito com amor' },
              ].map((t) => (
                <span key={t.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
                  <span>{t.icon}</span>{t.text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Coluna da imagem (desktop: direita / mobile: acima) ── */}
          <div className="lp-hero-image" style={{ position: 'relative' }}>

            {/* Blob decorativo atrás */}
            <div style={{
              position: 'absolute', inset: '-20px -10px -20px -10px',
              background: 'radial-gradient(ellipse at 60% 40%, #DBEAFE88 0%, #BBF7D044 60%, transparent 100%)',
              borderRadius: '40% 60% 60% 40% / 50% 40% 60% 50%',
              zIndex: 0,
            }} />

            {/* Foto principal */}
            <img
              src="/site02.png"
              alt="Mãe e filho usando o AUTVYA juntos no tablet"
              style={{
                width: '100%',
                borderRadius: '1.75rem',
                boxShadow: '0 32px 80px rgba(79,127,255,0.15), 0 8px 32px rgba(0,0,0,0.10)',
                display: 'block',
                position: 'relative',
                zIndex: 1,
              }}
            />

            {/* Badge flutuante — canto inferior esquerdo */}
            <div style={{
              position: 'absolute', bottom: 20, left: -16, zIndex: 2,
              background: 'white', borderRadius: '1rem',
              padding: '10px 14px',
              boxShadow: '0 8px 28px rgba(0,0,0,0.13)',
              display: 'flex', alignItems: 'center', gap: 10,
              border: '1px solid #F1F5F9',
            }}>
              <span style={{ fontSize: '1.6rem' }}>🎉</span>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>Primeira palavra!</div>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Miguel disse "Água" 💧</div>
              </div>
            </div>

            {/* Badge flutuante — canto superior direito */}
            <div style={{
              position: 'absolute', top: 18, right: -14, zIndex: 2,
              background: '#4F7FFF', borderRadius: '1rem',
              padding: '8px 14px',
              boxShadow: '0 8px 24px #4F7FFF44',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: '1.1rem' }}>⭐</span>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>5 estrelas hoje!</div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.82)' }}>Sessão de 12 min</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          APP PREVIEW — carrossel dos mockups
      ══════════════════════════════════════════════════════════════ */}
      <section id="app-preview" style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              display: 'inline-block',
              background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 20,
              padding: '4px 14px', marginBottom: 14,
              fontSize: '0.78rem', fontWeight: 700, color: '#15803D',
            }}>
              Interface do app
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 900, color: '#0F172A', margin: '0 0 12px' }}>
              Simples para a criança,<br />poderoso para os pais
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
              Interface adaptada para cada fase do desenvolvimento, com feedback visual e sonoro imediato.
            </p>
          </div>
          <Carousel />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          COMO FUNCIONA
      ══════════════════════════════════════════════════════════════ */}
      <section id="como-funciona" style={{ padding: '80px 20px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 900, color: '#0F172A', margin: '0 0 12px' }}>
              Como funciona
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
              Em 4 passos simples, sua família começa a se comunicar melhor.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {COMO_FUNCIONA.map((step) => (
              <div key={step.num} style={{
                background: 'white', border: '1.5px solid #F1F5F9',
                borderRadius: '1.25rem', padding: '28px 22px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  width: 48, height: 48,
                  background: 'linear-gradient(135deg, #EBF4FF, #DBEAFE)',
                  borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', marginBottom: 16,
                }}>
                  {step.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4F7FFF', background: '#EBF4FF', borderRadius: 6, padding: '2px 7px', flexShrink: 0 }}>
                    {step.num}
                  </span>
                  <h3 style={{ fontSize: '0.97rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {step.title}
                  </h3>
                </div>
                <p style={{ fontSize: '0.87rem', color: '#64748B', lineHeight: 1.65, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          AS 3 FASES
      ══════════════════════════════════════════════════════════════ */}
      <section id="fases" style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 900, color: '#0F172A', margin: '0 0 12px' }}>
              As 3 fases de desenvolvimento
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
              Cada criança progride no seu ritmo, guiada por metodologia baseada em PECS e Comunicação Aumentativa.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {FASES.map((fase) => (
              <div key={fase.title} style={{
                background: fase.bg, border: `2px solid ${fase.border}`,
                borderRadius: '1.25rem', padding: '32px 26px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}>
                <div style={{ fontSize: '2.4rem', marginBottom: 14 }}>{fase.emoji}</div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 900, color: fase.color, margin: '0 0 10px' }}>
                  {fase.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                  {fase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #4F7FFF 0%, #6366F1 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>💙</div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: 'white', margin: '0 0 14px' }}>
            Comece hoje — é gratuito
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', margin: '0 0 36px', lineHeight: 1.65 }}>
            Milhares de famílias já descobriram o poder de ouvir a voz do seu filho.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/registro" style={{
              background: 'white', color: '#4F7FFF', textDecoration: 'none',
              padding: '15px 34px', borderRadius: '1rem', fontWeight: 800, fontSize: '1rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'inline-block',
            }}>
              Criar conta grátis
            </Link>
            <Link to="/login" style={{
              background: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none',
              padding: '15px 32px', borderRadius: '1rem', fontWeight: 700, fontSize: '1rem',
              border: '2px solid rgba(255,255,255,0.3)', display: 'inline-block',
            }}>
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer style={{ background: '#0F172A', padding: '48px 20px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="lp-footer-grid" style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 40,
          }}>
            <div>
              <img src="/logoaltvya.png" alt="AUTVYA" style={{ height: 34, objectFit: 'contain', marginBottom: 14, filter: 'brightness(0) invert(1)' }} />
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, margin: 0, maxWidth: 280 }}>
                Comunicação que inclui. Plataforma de CAA gamificada para crianças neurodiversas (4–10 anos).
              </p>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'white', marginBottom: 16, fontSize: '0.9rem' }}>Plataforma</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem' }}>Entrar</Link>
                <Link to="/registro" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem' }}>Cadastrar</Link>
                <button onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', padding: 0, textAlign: 'left' }}>
                  Metodologia
                </button>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'white', marginBottom: 16, fontSize: '0.9rem' }}>Contato</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Alfeu Smart Solution</span>
                <span style={{ fontSize: '0.85rem', color: '#A6E3A1', display: 'flex', alignItems: 'center', gap: 5 }}>📱 WhatsApp</span>
              </div>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24,
            display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between',
            alignItems: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)',
          }}>
            <span>© 2026 Alfeu Smart Solution. Todos os direitos reservados.</span>
            <span>Feito com 💙 para crianças neurodiversas</span>
          </div>
        </div>
      </footer>

      {/* ── CSS responsivo ────────────────────────────────────────── */}
      <style>{`
        html { scroll-behavior: smooth; }

        .lp-hamburger { display: none !important; }

        @media (max-width: 767px) {
          .lp-desktop-nav  { display: none !important; }
          .lp-hamburger    { display: flex !important; }
          .lp-hero-grid    { grid-template-columns: 1fr !important; }
          .lp-hero-image   { order: -1; }
          .lp-footer-grid  { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>
    </div>
  );
}
