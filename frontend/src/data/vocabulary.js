// Dicionário completo de símbolos – AUTVYA
// Baseado em Core Vocabulary AAC (Beukelman & Miranda, 2013) + PECS + LAMP

export const SYMBOLS = {
  // ── FASE 1 – Núcleo (6 símbolos de alta frequência) ───────────────────────
  agua:      { icon: '💧', label: 'Água',      bg: '#3FA9F5', shadow: '#1F7FC7', tts: 'Água'       },
  comer:     { icon: '🍎', label: 'Comer',     bg: '#F05A30', shadow: '#C03818', tts: 'Comer'      },
  brincar:   { icon: '🎈', label: 'Brincar',   bg: '#6DC420', shadow: '#4E9015', tts: 'Brincar'    },
  mais:      { icon: '➕', label: 'Mais',      bg: '#9468CC', shadow: '#6840A8', tts: 'Mais'       },
  dormir:    { icon: '😴', label: 'Dormir',    bg: '#20B8B2', shadow: '#158A85', tts: 'Dormir'     },
  nao:       { icon: '🚫', label: 'Não',       bg: '#E83535', shadow: '#B82020', tts: 'Não'        },

  // ── FASE 2 – Bebidas ───────────────────────────────────────────────────────
  suco:      { icon: '🥤', label: 'Suco',      bg: '#FF9800', shadow: '#E65100', tts: 'Suco'       },
  leite:     { icon: '🥛', label: 'Leite',     bg: '#64B5F6', shadow: '#1565C0', tts: 'Leite'      },

  // ── FASE 2 – Comidas ──────────────────────────────────────────────────────
  fruta:     { icon: '🍓', label: 'Fruta',     bg: '#F06292', shadow: '#880E4F', tts: 'Fruta'      },
  lanche:    { icon: '🍪', label: 'Lanche',    bg: '#A1887F', shadow: '#4E342E', tts: 'Lanche'     },
  almoco:    { icon: '🍲', label: 'Almoço',    bg: '#FF7043', shadow: '#BF360C', tts: 'Almoço'     },

  // ── FASE 2 – Atividades ───────────────────────────────────────────────────
  bola:      { icon: '⚽', label: 'Bola',      bg: '#66BB6A', shadow: '#1B5E20', tts: 'Bola'       },
  musica:    { icon: '🎵', label: 'Música',    bg: '#AB47BC', shadow: '#6A1B9A', tts: 'Música'     },
  pintar:    { icon: '🎨', label: 'Pintar',    bg: '#FF5722', shadow: '#BF360C', tts: 'Pintar'     },
  parque:    { icon: '🛝', label: 'Parque',    bg: '#42A5F5', shadow: '#1565C0', tts: 'Parque'     },

  // ── FASE 2 – Descanso ─────────────────────────────────────────────────────
  descansar: { icon: '🛋️', label: 'Descansar', bg: '#78909C', shadow: '#37474F', tts: 'Descansar'  },

  // ── FASE 3 – Sujeitos ─────────────────────────────────────────────────────
  eu:        { icon: '🙋', label: 'Eu',        bg: '#5C6BC0', shadow: '#283593', tts: 'Eu'         },
  voce:      { icon: '👉', label: 'Você',      bg: '#26A69A', shadow: '#004D40', tts: 'Você'       },

  // ── FASE 3 – Ações/Verbos ─────────────────────────────────────────────────
  quero:     { icon: '🤲', label: 'Quero',     bg: '#42A5F5', shadow: '#1565C0', tts: 'Quero'      },
  nao_quero: { icon: '🙅', label: 'Não quero', bg: '#EF5350', shadow: '#B71C1C', tts: 'Não quero'  },
  gosto:     { icon: '❤️', label: 'Gosto',     bg: '#EC407A', shadow: '#880E4F', tts: 'Gosto'      },
  ajuda:     { icon: '🙏', label: 'Ajuda',     bg: '#FF7043', shadow: '#BF360C', tts: 'Ajuda'      },
  vou:       { icon: '🚶', label: 'Vou',       bg: '#66BB6A', shadow: '#1B5E20', tts: 'Vou'        },

  // ── FASE 3 – Sentimentos ──────────────────────────────────────────────────
  feliz:     { icon: '😄', label: 'Feliz',     bg: '#FFD54F', shadow: '#FF8F00', tts: 'Feliz'      },
  triste:    { icon: '😢', label: 'Triste',    bg: '#78909C', shadow: '#37474F', tts: 'Triste'     },
  com_dor:   { icon: '🤕', label: 'Com dor',   bg: '#EF9A9A', shadow: '#C62828', tts: 'Com dor'    },
  cansado:   { icon: '😫', label: 'Cansado',   bg: '#B0BEC5', shadow: '#546E7A', tts: 'Cansado'    },

  // ── FASE 3 – Social ───────────────────────────────────────────────────────
  oi:        { icon: '👋', label: 'Oi',        bg: '#FFD700', shadow: '#FF8F00', tts: 'Oi'         },
  tchau:     { icon: '🤚', label: 'Tchau',     bg: '#FFCA28', shadow: '#FF6F00', tts: 'Tchau'      },
  obrigado:  { icon: '😊', label: 'Obrigado',  bg: '#A5D6A7', shadow: '#2E7D32', tts: 'Obrigado'   },
  sim:       { icon: '✅', label: 'Sim',       bg: '#66BB6A', shadow: '#1B5E20', tts: 'Sim'        },
};

// ── Fase 1: grade de núcleo ────────────────────────────────────────────────
export const FASE1_SIMBOLOS = ['agua', 'comer', 'brincar', 'mais', 'dormir', 'nao'];

// ── Fase 2: sub-escolhas por categoria ────────────────────────────────────
export const FASE2_CONTEXTOS = {
  agua:    { prompt: 'O que você quer beber?',   opcoes: ['agua', 'suco', 'leite', 'mais']        },
  comer:   { prompt: 'O que você quer comer?',   opcoes: ['fruta', 'lanche', 'almoco', 'mais']    },
  brincar: { prompt: 'Como você quer brincar?',  opcoes: ['bola', 'musica', 'pintar', 'parque']   },
  dormir:  { prompt: 'Você quer descansar?',     opcoes: ['dormir', 'descansar', 'nao', 'mais']   },
  mais:    null,  // exibe mais opções no nível 1
  nao:     null,  // registra negação e retorna
};

// ── Fase 3: abas de vocabulário ───────────────────────────────────────────
export const FASE3_ABAS = [
  {
    id: 'acoes',
    label: '🤲 Ações',
    simbolos: ['eu', 'voce', 'quero', 'nao_quero', 'gosto', 'ajuda', 'vou', 'sim', 'nao'],
  },
  {
    id: 'coisas',
    label: '🍎 Coisas',
    simbolos: ['agua', 'comer', 'brincar', 'dormir', 'suco', 'leite', 'fruta', 'lanche', 'bola', 'musica', 'pintar', 'parque'],
  },
  {
    id: 'sentimentos',
    label: '😄 Sentimentos',
    simbolos: ['feliz', 'triste', 'com_dor', 'cansado', 'mais', 'ajuda'],
  },
  {
    id: 'social',
    label: '👋 Social',
    simbolos: ['oi', 'tchau', 'obrigado', 'sim', 'nao', 'mais'],
  },
];

// ── Fase 3: frases-modelo rápidas ────────────────────────────────────────
export const FASE3_TEMPLATES = [
  { label: 'Eu quero…',     simbolos: ['eu', 'quero'],     tts: 'Eu quero'      },
  { label: 'Não quero…',    simbolos: ['eu', 'nao_quero'], tts: 'Eu não quero'  },
  { label: 'Eu gosto de…',  simbolos: ['eu', 'gosto'],     tts: 'Eu gosto de'   },
  { label: 'Me ajuda com…', simbolos: ['eu', 'ajuda'],     tts: 'Me ajuda com'  },
];

// ── Critérios de prontidão para avançar de fase ───────────────────────────
export const READINESS_CRITERIA = {
  CONEXAO_TO_ESCOLHA: {
    minInteracoes: 20,
    minDiasAtivos: 7,
    minSimbolosUsados: 4,
    descricao: 'Criança usa 4+ símbolos em 7+ dias com 20+ toques no total',
  },
  ESCOLHA_TO_COMUNICACAO: {
    minInteracoes: 40,
    minDiasAtivos: 10,
    minSimbolosUsados: 6,
    descricao: 'Criança escolhe consistentemente em contextos, usa 6+ símbolos',
  },
};

export function checkReadiness(fase, metricas) {
  const criteria = READINESS_CRITERIA[
    fase === 'CONEXAO' ? 'CONEXAO_TO_ESCOLHA' : 'ESCOLHA_TO_COMUNICACAO'
  ];
  if (!criteria || !metricas) return false;
  return (
    metricas.totalInteracoes >= criteria.minInteracoes &&
    metricas.diasAtivos >= criteria.minDiasAtivos &&
    Object.keys(metricas.contagemBotoes || {}).length >= criteria.minSimbolosUsados
  );
}
