import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuTvyaLogo from '../components/AuTvyaLogo.jsx';

// ── Dados das seções ──────────────────────────────────────────────────────────

const FASES = [
  {
    id: 'fase1',
    numero: '01',
    nome: 'Conexão',
    emoji: '🌱',
    cor: '#3FA9F5',
    corClaro: '#EBF5FF',
    corBorda: '#BFDBFE',
    subtitulo: 'Aprender que símbolos comunicam',
    descricao:
      'A criança descobre que tocar uma imagem produz um resultado real: a voz fala, o adulto responde. É o momento do "clique" — a compreensão de que ela pode se expressar.',
    como: [
      'Grade 2×3 com 6 símbolos de alta frequência (água, comer, brincar, mais, dormir, não)',
      'Toque único → síntese de voz imediata → animação → estrela de recompensa',
      'Celebração a cada 5 interações para reforçar o engajamento',
      'Sem hierarquia nem escolha entre opções — foco puro na relação causa-efeito',
    ],
    base: [
      { sigla: 'PECS I–II', nome: 'Picture Exchange Communication System', autores: 'Bondy & Frost, 1994' },
      { sigla: 'Reforço positivo', nome: 'Princípios de condicionamento operante aplicados à CAA', autores: 'Skinner; adaptado por Lovaas' },
    ],
    criterio: 'Critério de avanço sugerido: 20+ interações, 7+ dias ativos, 4+ símbolos distintos usados.',
  },
  {
    id: 'fase2',
    numero: '02',
    nome: 'Escolha',
    emoji: '⭐',
    cor: '#FF9800',
    corClaro: '#FFF8E1',
    corBorda: '#FFE082',
    subtitulo: 'Discriminar e escolher com significado',
    descricao:
      'A criança aprende a distinguir símbolos diferentes e a selecionar o que realmente quer dentro de um contexto. A comunicação passa a ter intenção e especificidade.',
    como: [
      'Navegação em dois níveis: categoria → opção específica (ex.: Comer → Fruta, Lanche, Almoço)',
      'Card de contexto exibe a pergunta em linguagem natural ("O que você quer comer?")',
      'TTS fala a escolha completa para modelar a linguagem ao redor da criança',
      'Transição animada entre os níveis para clareza visual',
    ],
    base: [
      { sigla: 'PECS III', nome: 'Discriminação de símbolos', autores: 'Bondy & Frost, 2002' },
      { sigla: 'ALgS', nome: 'Aided Language Stimulation — modelagem de linguagem no sistema de CAA', autores: 'Goossens, Crain & Elder, 1992' },
      { sigla: 'ALS', nome: 'Aided Language Input — parceiro modela no dispositivo enquanto fala', autores: 'Binger & Light, 2007' },
    ],
    criterio: 'Critério de avanço sugerido: 40+ interações, 10+ dias ativos, 6+ símbolos distintos.',
  },
  {
    id: 'fase3',
    numero: '03',
    nome: 'Comunicação',
    emoji: '🚀',
    cor: '#4CAF50',
    corClaro: '#F0FDF4',
    corBorda: '#BBF7D0',
    subtitulo: 'Combinar símbolos para formar mensagens',
    descricao:
      'A criança combina 2–5 símbolos para expressar pensamentos completos com estrutura sujeito-verbo-objeto. A comunicação torna-se espontânea e criativa.',
    como: [
      'Faixa de sentença visível no topo — a criança "escreve" a mensagem tocando símbolos',
      'TTS imediato em cada toque (motor planning: localização fixa de cada símbolo)',
      'Vocabulário núcleo fixo (alta frequência) + vocabulário periférico por categoria',
      'Templates rápidos: "Eu quero…", "Não quero…", "Eu gosto de…", "Me ajuda com…"',
      '4 abas: Ações · Coisas · Sentimentos · Social',
      'Histórico das últimas frases da sessão para o acompanhante modelar',
    ],
    base: [
      { sigla: 'Core Vocabulary', nome: 'Vocabulário núcleo: ~250 palavras cobrem 80% da comunicação funcional', autores: 'Beukelman & Miranda, 2013' },
      { sigla: 'LAMP', nome: 'Language Acquisition through Motor Planning — posição consistente gera automatismo motor', autores: 'Halloran & Halloran, 2006' },
      { sigla: 'Carrier Phrases', nome: 'Frases portadoras como andaime linguístico (scaffolding)', autores: 'Vygotsky ZDP; aplicado por Light & McNaughton' },
      { sigla: 'BNCC', nome: 'Eixos de linguagem oral e escrita para Ed. Infantil (4–5 anos)', autores: 'MEC, 2018' },
    ],
    criterio: 'Fase contínua — a complexidade das frases cresce gradualmente com o uso.',
  },
];

const METODOLOGIAS = [
  {
    sigla: 'PECS',
    nome: 'Picture Exchange Communication System',
    descricao:
      'Sistema estruturado de 6 fases que ensina a criança a iniciar comunicação através da troca de imagens. Amplamente validado para autismo com forte evidência empírica (mais de 200 estudos publicados).',
    link: 'Bondy & Frost — Pyramid Educational Consultants, 1994',
  },
  {
    sigla: 'ALgS / ALS',
    nome: 'Aided Language Stimulation',
    descricao:
      'O parceiro de comunicação aponta os símbolos no sistema CAA enquanto fala, modelando o uso do dispositivo. Considerado "melhores práticas" pela ASHA (American Speech-Language-Hearing Association) para CAA.',
    link: 'Goossens, Crain & Elder, 1992 · Binger & Light, 2007',
  },
  {
    sigla: 'Core Vocabulary',
    nome: 'Vocabulário Núcleo',
    descricao:
      'Aproximadamente 200–400 palavras de alta frequência representam cerca de 80% do que as pessoas dizem no dia a dia. Para crianças pequenas, um núcleo de ~50 palavras funcionais permite comunicação imediata em múltiplos contextos.',
    link: 'Beukelman & Miranda — Augmentative & Alternative Communication, 2013',
  },
  {
    sigla: 'LAMP',
    nome: 'Language Acquisition through Motor Planning',
    descricao:
      'Baseia-se na aprendizagem motora: cada símbolo ocupa sempre a mesma posição no dispositivo, criando memória muscular. Reduz a carga cognitiva e acelera a fluência comunicativa.',
    link: 'Halloran & Halloran — LAMP Words for Life, 2006',
  },
  {
    sigla: 'ZDP / Scaffolding',
    nome: 'Zona de Desenvolvimento Proximal',
    descricao:
      'As frases-template ("Eu quero ___") funcionam como andaimes linguísticos: oferecem a estrutura que a criança ainda não produz sozinha, permitindo comunicação funcional enquanto desenvolve autonomia.',
    link: 'Vygotsky, 1978 · aplicação em CAA: Light & McNaughton, 2014',
  },
];

const REFERENCIAS = [
  'Beukelman, D. R., & Miranda, P. (2013). Augmentative & Alternative Communication (4ª ed.). Paul H. Brookes.',
  'Binger, C., & Light, J. (2007). The effect of aided AAC modeling on the expression of multi-symbol messages. Journal of Speech, Language, and Hearing Research, 50(3), 655–667.',
  'Bondy, A., & Frost, L. (2001). The Picture Exchange Communication System. Behavior Modification, 25(5), 725–744.',
  'Goossens, C., Crain, S., & Elder, P. (1992). Engineering the preschool environment for interactive symbolic communication. Southeast Augmentative Communication Conference Publications.',
  'Halloran, J., & Halloran, M. (2006). LAMP: Language Acquisition through Motor Planning. LAMP Words for Life.',
  'Light, J., & McNaughton, D. (2014). Communicative Competence for Individuals who require Augmentative and Alternative Communication. Augmentative and Alternative Communication, 30(1), 1–18.',
  'MEC. (2018). Base Nacional Comum Curricular — Educação Infantil. Brasília: Ministério da Educação.',
  'Vygotsky, L. S. (1978). Mind in Society: The Development of Higher Psychological Processes. Harvard University Press.',
];

// ── Componentes internos ──────────────────────────────────────────────────────

function FaseCard({ fase }) {
  const [aberta, setAberta] = useState(false);

  return (
    <div style={{ borderRadius: 20, border: `2px solid ${fase.corBorda}`, background: fase.corClaro, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {/* Cabeçalho clicável */}
      <button
        onClick={() => setAberta((v) => !v)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}
      >
        <div style={{ width: 48, height: 48, background: fase.cor, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 4px 12px ${fase.cor}55` }}>
          {fase.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: fase.cor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Fase {fase.numero}
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#1A3A6B', lineHeight: 1.1 }}>{fase.nome}</div>
          <div style={{ fontSize: 12, color: '#5A8AB0', fontWeight: 500, marginTop: 2 }}>{fase.subtitulo}</div>
        </div>
        <span style={{ fontSize: 20, color: fase.cor, transform: aberta ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>⌄</span>
      </button>

      {/* Conteúdo expansível */}
      {aberta && (
        <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Descrição */}
          <p style={{ margin: 0, fontSize: 14, color: '#2C4A6A', lineHeight: 1.6, borderLeft: `3px solid ${fase.cor}`, paddingLeft: 12 }}>
            {fase.descricao}
          </p>

          {/* Como funciona */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: fase.cor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Como funciona no AUTVYA
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {fase.como.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#2C4A6A', lineHeight: 1.5 }}>
                  <span style={{ color: fase.cor, fontWeight: 900, flexShrink: 0, marginTop: 1 }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Embasamento */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: fase.cor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Embasamento científico
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {fase.base.map((b, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '8px 12px', border: `1px solid ${fase.corBorda}` }}>
                  <span style={{ fontWeight: 900, fontSize: 13, color: fase.cor }}>{b.sigla}</span>
                  <span style={{ fontSize: 12, color: '#4A6A88', fontWeight: 500 }}> — {b.nome}</span>
                  <div style={{ fontSize: 11, color: '#7A9EB8', marginTop: 2 }}>{b.autores}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Critério de avanço */}
          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'flex-start', border: `1px dashed ${fase.corBorda}` }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🎯</span>
            <p style={{ margin: 0, fontSize: 12, color: '#2C4A6A', lineHeight: 1.5 }}>{fase.criterio}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MetodologiaCard({ met }) {
  const [aberta, setAberta] = useState(false);
  return (
    <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.9)', border: '1.5px solid #DDE8F5', overflow: 'hidden' }}>
      <button
        onClick={() => setAberta((v) => !v)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}
      >
        <div style={{ background: '#4A90D9', color: 'white', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 900, flexShrink: 0, letterSpacing: '0.04em' }}>
          {met.sigla}
        </div>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: '#1A3A6B' }}>{met.nome}</span>
        <span style={{ fontSize: 16, color: '#7A9EB8', transform: aberta ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>⌄</span>
      </button>
      {aberta && (
        <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ margin: 0, fontSize: 13, color: '#2C4A6A', lineHeight: 1.6 }}>{met.descricao}</p>
          <div style={{ fontSize: 11, color: '#7A9EB8', fontStyle: 'italic' }}>📚 {met.link}</div>
        </div>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function Sobre() {
  const navigate = useNavigate();
  const [secaoAberta, setSecaoAberta] = useState('fases'); // 'fases' | 'metodologias' | 'referencias'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #6EC4E8 0%, #93D3EF 20%, #BDE5F5 45%, #DFF2FB 70%, #F5FBFF 100%)',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 40,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px 10px', position: 'sticky', top: 0, zIndex: 20, background: 'rgba(110,196,232,0.7)', backdropFilter: 'blur(10px)' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.72)', border: 'none', borderRadius: 12, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ←
        </button>
        <AuTvyaLogo size="md" />
        <div style={{ width: 40 }} />
      </div>

      <div style={{ padding: '0 16px', maxWidth: 520, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Apresentação */}
        <div style={{ background: 'rgba(255,255,255,0.88)', borderRadius: 22, padding: '20px 20px', backdropFilter: 'blur(8px)', textAlign: 'center' }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🧠</div>
          <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 900, color: '#1A3A6B' }}>
            Metodologia AUTVYA
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: '#4A6A88', lineHeight: 1.6 }}>
            A plataforma foi desenvolvida com base nas metodologias mais validadas pela ciência para
            <strong> Comunicação Aumentativa e Alternativa (CAA)</strong> com crianças neurodiversas.
            Esta página explica o que usamos, por que usamos e onde cada abordagem é aplicada.
          </p>
        </div>

        {/* Tabs de seção */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.7)', borderRadius: 16, padding: 4, gap: 3, backdropFilter: 'blur(6px)' }}>
          {[
            { id: 'fases',         label: '🌱 As 3 Fases'      },
            { id: 'metodologias',  label: '📖 Metodologias'    },
            { id: 'referencias',   label: '📚 Referências'     },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSecaoAberta(tab.id)}
              style={{ flex: 1, padding: '9px 4px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12, background: secaoAberta === tab.id ? 'white' : 'transparent', color: secaoAberta === tab.id ? '#1A3A6B' : '#7A9EB8', boxShadow: secaoAberta === tab.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Seção: As 3 Fases ───────────────────────────────────── */}
        {secaoAberta === 'fases' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: '0 0 4px', fontSize: 13, color: '#4A6A88', lineHeight: 1.5, textAlign: 'center' }}>
              Toque em cada fase para ver detalhes da abordagem, como ela funciona no app e seu embasamento.
            </p>
            {FASES.map((fase) => <FaseCard key={fase.id} fase={fase} />)}

            {/* Aviso profissional */}
            <div style={{ background: 'rgba(255,244,214,0.95)', border: '1.5px solid #FFD166', borderRadius: 18, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>⚠️</span>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 13, color: '#7A4A00' }}>Decisão de avanço de fase</p>
                <p style={{ margin: 0, fontSize: 12, color: '#7A4A00', lineHeight: 1.5 }}>
                  Os critérios exibidos no app são <em>sugestivos</em>. A decisão de avançar de fase deve
                  sempre ser tomada em conjunto com <strong>fonoaudiólogo, terapeuta ocupacional ou outro
                  profissional especializado em CAA</strong>, que avaliará a criança individualmente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Seção: Metodologias ─────────────────────────────────── */}
        {secaoAberta === 'metodologias' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ margin: '0 0 4px', fontSize: 13, color: '#4A6A88', lineHeight: 1.5, textAlign: 'center' }}>
              Cada metodologia tem evidências científicas robustas e é recomendada pela comunidade internacional de CAA.
            </p>
            {METODOLOGIAS.map((met) => <MetodologiaCard key={met.sigla} met={met} />)}

            {/* Sobre a CAA */}
            <div style={{ background: 'rgba(255,255,255,0.88)', borderRadius: 18, padding: '16px 18px', border: '1.5px solid #BFDBFE' }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#4A90D9', marginBottom: 8 }}>O que é CAA?</div>
              <p style={{ margin: 0, fontSize: 13, color: '#2C4A6A', lineHeight: 1.65 }}>
                <strong>Comunicação Aumentativa e Alternativa (CAA)</strong> engloba todos os modos de
                comunicação que complementam ou substituem a fala quando esta está ausente, limitada ou
                temporariamente comprometida. Inclui linguagem de sinais, símbolos gráficos, dispositivos
                eletrônicos com síntese de voz e aplicativos como o AUTVYA.
              </p>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: '#7A9EB8', fontStyle: 'italic' }}>
                Fonte: ASHA — American Speech-Language-Hearing Association
              </p>
            </div>
          </div>
        )}

        {/* ── Seção: Referências ──────────────────────────────────── */}
        {secaoAberta === 'referencias' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ margin: '0 0 4px', fontSize: 13, color: '#4A6A88', lineHeight: 1.5, textAlign: 'center' }}>
              Fontes primárias utilizadas na concepção pedagógica do AUTVYA.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 18, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, border: '1.5px solid #DDE8F5' }}>
              {REFERENCIAS.map((ref, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 900, color: '#4A90D9', fontSize: 13, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                  <p style={{ margin: 0, fontSize: 12, color: '#2C4A6A', lineHeight: 1.6 }}>{ref}</p>
                </div>
              ))}
            </div>

            {/* Nota de transparência */}
            <div style={{ background: 'rgba(240,253,244,0.95)', borderRadius: 16, padding: '14px 16px', border: '1.5px solid #BBF7D0' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 18 }}>✅</span>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 13, color: '#1A3A6B' }}>Comprometimento com evidência</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#2C4A6A', lineHeight: 1.5 }}>
                    O AUTVYA utiliza apenas abordagens com suporte em pesquisas publicadas em periódicos
                    revisados por pares. Não endossamos práticas sem evidência científica.
                    A plataforma complementa — e nunca substitui — o acompanhamento profissional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
