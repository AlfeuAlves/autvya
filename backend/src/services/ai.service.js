const anthropic = require('../config/anthropic');

const SYSTEM_PROMPT = `Você é um especialista em desenvolvimento infantil, com foco em crianças neurodiversas (autismo, TDAH, TEA e outros perfis).
Você analisa dados de interação de uma plataforma de comunicação aumentativa e alternativa (CAA) para crianças de 4 a 10 anos.

REGRAS FUNDAMENTAIS:
1. NUNCA emita diagnósticos clínicos ou afirmações médicas definitivas
2. NUNCA use linguagem alarmista ou que gere ansiedade nos cuidadores
3. Sempre enfatize que você complementa (não substitui) profissionais de saúde
4. Use linguagem acolhedora, positiva e baseada em pontos fortes
5. Todas as respostas devem ser em português brasileiro
6. Respeite a privacidade e dignidade da criança

Seu papel é identificar padrões de comunicação, sugerir estratégias práticas e gerar insights baseados em evidências para pais e educadores.`;

async function analisarCrianca({ crianca, metricas, historico }) {
  const prompt = montarPrompt({ crianca, metricas, historico });

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const texto = message.content[0].text;

  try {
    // Extrair JSON da resposta
    const jsonMatch = texto.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    // Tentar parsear diretamente
    return JSON.parse(texto);
  } catch {
    // Retornar estrutura com texto bruto se não for JSON válido
    return {
      resumo: texto,
      nivel_estimado: null,
      habilidades: [],
      pontos_atencao: [],
      recomendacoes: [],
      relatorio_tecnico: null,
      aviso: 'Esta análise é baseada em padrões de uso e não constitui diagnóstico clínico.',
    };
  }
}

function montarPrompt({ crianca, metricas, historico }) {
  const fasesDescricao = {
    CONEXAO: 'Fase 1 - Conexão: aprendendo a usar pictogramas básicos',
    ESCOLHA: 'Fase 2 - Escolha: selecionando entre opções contextuais',
    COMUNICACAO: 'Fase 3 - Comunicação: combinando pictogramas para frases',
  };

  return `Analise os dados de interação da criança abaixo e gere um relatório estruturado em JSON.

## DADOS DA CRIANÇA
- Nome: ${crianca.nome}
- Idade: ${crianca.idade} anos
- Fase atual: ${fasesDescricao[crianca.fase]}

## MÉTRICAS DE USO (últimos ${metricas.periodo.dias} dias)
- Total de interações: ${metricas.totalInteracoes}
- Dias ativos: ${metricas.diasAtivos}
- Botão favorito: ${metricas.botaoFavorito || 'N/A'}
- Duração média de sessão: ${metricas.duracaoMedia} segundos
- Distribuição por botão: ${JSON.stringify(metricas.contagemBotoes)}
- Uso por hora do dia: ${JSON.stringify(metricas.usoPorHora)}

## SEQUÊNCIA RECENTE (últimas interações)
${metricas.sequenciaRecente
  .slice(-20)
  .map((i) => `- ${i.botao} em ${new Date(i.timestamp).toLocaleString('pt-BR')}`)
  .join('\n')}

## CONFIGURAÇÕES SENSORIAIS
${JSON.stringify(crianca.configuracoes || {}, null, 2)}

Por favor, responda APENAS com um JSON válido no seguinte formato:
\`\`\`json
{
  "resumo": "Parágrafo acolhedor para pais, linguagem simples, 2-3 frases",
  "nivel_estimado": "Descrição do nível de engajamento observado (sem diagnóstico)",
  "habilidades": [
    "Habilidade observada 1",
    "Habilidade observada 2"
  ],
  "pontos_atencao": [
    "Aspecto para observar/desenvolver 1"
  ],
  "recomendacoes": [
    {
      "titulo": "Título da recomendação",
      "descricao": "Descrição prática do que fazer",
      "categoria": "comunicacao|rotina|sensorial|social"
    }
  ],
  "relatorio_tecnico": {
    "padrao_comunicacao": "Análise técnica do padrão de comunicação",
    "referencias_teoricas": "Conexão com Piaget, Vygotsky, BNCC quando aplicável",
    "indicadores_comportamentais": "Indicadores observados nos dados"
  },
  "aviso": "Esta análise baseia-se em padrões de uso da plataforma e não constitui diagnóstico clínico. Consulte sempre profissionais especializados."
}
\`\`\``;
}

module.exports = { analisarCrianca };
