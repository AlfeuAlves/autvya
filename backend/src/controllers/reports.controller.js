const prisma = require('../config/database');
const { getChildMetrics, getDailyUsage } = require('../services/metrics.service');

async function relatorio(req, res) {
  const { criancaId } = req.params;
  const dias = parseInt(req.query.dias) || 30;

  try {
    const crianca = await prisma.child.findUnique({
      where: { id: criancaId },
      include: { _count: { select: { interacoes: true } } },
    });

    if (!crianca) {
      return res.status(404).json({ error: 'Criança não encontrada.' });
    }
    if (crianca.usuarioId !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const [metricas, usoDiario] = await Promise.all([
      getChildMetrics(criancaId, dias),
      getDailyUsage(criancaId, dias),
    ]);

    // Interações recentes detalhadas
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);

    const interacoesDetalhadas = await prisma.interaction.findMany({
      where: {
        criancaId,
        timestamp: { gte: dataInicio },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    return res.json({
      crianca: {
        id: crianca.id,
        nome: crianca.nome,
        idade: crianca.idade,
        fase: crianca.fase,
        configuracoes: crianca.configuracoes,
      },
      metricas,
      usoDiario,
      interacoesRecentes: interacoesDetalhadas,
      geradoEm: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Erro ao gerar relatório:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

async function resumoGeral(req, res) {
  try {
    const filhos = await prisma.child.findMany({
      where: { usuarioId: req.userId },
      include: { _count: { select: { interacoes: true } } },
    });

    const resumos = await Promise.all(
      filhos.map(async (filho) => {
        const metricas = await getChildMetrics(filho.id, 7);
        return {
          id: filho.id,
          nome: filho.nome,
          idade: filho.idade,
          fase: filho.fase,
          totalInteracoes: filho._count.interacoes,
          ultimaSemana: metricas.totalInteracoes,
          diasAtivos: metricas.diasAtivos,
          botaoFavorito: metricas.botaoFavorito,
        };
      })
    );

    return res.json({ resumos, geradoEm: new Date().toISOString() });
  } catch (err) {
    console.error('Erro ao gerar resumo:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

module.exports = { relatorio, resumoGeral };
