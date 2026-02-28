const prisma = require('../config/database');

async function getChildMetrics(criancaId, dias = 30) {
  const dataInicio = new Date();
  dataInicio.setDate(dataInicio.getDate() - dias);

  const interacoes = await prisma.interaction.findMany({
    where: {
      criancaId,
      timestamp: { gte: dataInicio },
    },
    orderBy: { timestamp: 'asc' },
  });

  const totalInteracoes = interacoes.length;

  // Contagem por botão
  const contagemBotoes = {};
  for (const i of interacoes) {
    contagemBotoes[i.botao] = (contagemBotoes[i.botao] || 0) + 1;
  }

  // Botão favorito
  const botaoFavorito = Object.entries(contagemBotoes)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Dias ativos (dias únicos com interação)
  const diasAtivos = new Set(
    interacoes.map((i) => i.timestamp.toISOString().split('T')[0])
  ).size;

  // Uso por hora do dia
  const usoPorHora = Array(24).fill(0);
  for (const i of interacoes) {
    const hora = new Date(i.timestamp).getHours();
    usoPorHora[hora]++;
  }

  // Uso por dia da semana
  const usoPorDia = Array(7).fill(0);
  for (const i of interacoes) {
    const dia = new Date(i.timestamp).getDay();
    usoPorDia[dia]++;
  }

  // Duração média de sessão
  const sessionsComDuracao = interacoes.filter((i) => i.duracaoSessao);
  const duracaoMedia =
    sessionsComDuracao.length > 0
      ? Math.round(
          sessionsComDuracao.reduce((sum, i) => sum + i.duracaoSessao, 0) /
            sessionsComDuracao.length
        )
      : 0;

  // Sequência de botões recentes (últimas 50)
  const sequenciaRecente = interacoes.slice(-50).map((i) => ({
    botao: i.botao,
    timestamp: i.timestamp,
  }));

  return {
    totalInteracoes,
    contagemBotoes,
    botaoFavorito,
    diasAtivos,
    usoPorHora,
    usoPorDia,
    duracaoMedia,
    sequenciaRecente,
    periodo: { inicio: dataInicio, fim: new Date(), dias },
  };
}

async function getDailyUsage(criancaId, dias = 14) {
  const dataInicio = new Date();
  dataInicio.setDate(dataInicio.getDate() - dias);

  const interacoes = await prisma.interaction.findMany({
    where: {
      criancaId,
      timestamp: { gte: dataInicio },
    },
    orderBy: { timestamp: 'asc' },
  });

  const usoPorData = {};
  for (const i of interacoes) {
    const data = i.timestamp.toISOString().split('T')[0];
    usoPorData[data] = (usoPorData[data] || 0) + 1;
  }

  return usoPorData;
}

module.exports = { getChildMetrics, getDailyUsage };
