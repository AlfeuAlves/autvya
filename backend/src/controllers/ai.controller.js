const prisma = require('../config/database');
const { analisarCrianca } = require('../services/ai.service');
const { getChildMetrics } = require('../services/metrics.service');

async function analise(req, res) {
  const { criancaId, dias = 30 } = req.body;

  if (!criancaId) {
    return res.status(400).json({ error: 'criancaId é obrigatório.' });
  }

  try {
    const crianca = await prisma.child.findUnique({ where: { id: criancaId } });
    if (!crianca) {
      return res.status(404).json({ error: 'Criança não encontrada.' });
    }
    if (crianca.usuarioId !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const metricas = await getChildMetrics(criancaId, dias);

    if (metricas.totalInteracoes < 5) {
      return res.status(422).json({
        error: 'Dados insuficientes para análise. A criança precisa de pelo menos 5 interações.',
      });
    }

    const resultado = await analisarCrianca({
      crianca,
      metricas,
      historico: metricas.sequenciaRecente,
    });

    return res.json({ analise: resultado, geradoEm: new Date().toISOString() });
  } catch (err) {
    console.error('Erro na análise IA:', err);

    if (err.status === 429) {
      return res.status(429).json({ error: 'Limite de requisições atingido. Tente novamente em breve.' });
    }

    return res.status(500).json({ error: 'Erro ao gerar análise. Tente novamente.' });
  }
}

module.exports = { analise };
