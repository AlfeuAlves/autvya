const { validationResult } = require('express-validator');
const prisma = require('../config/database');
const { getChildMetrics, getDailyUsage } = require('../services/metrics.service');

async function registrar(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { criancaId, botao, duracaoSessao } = req.body;

  try {
    // Validar posse
    const crianca = await prisma.child.findUnique({ where: { id: criancaId } });
    if (!crianca) {
      return res.status(404).json({ error: 'Criança não encontrada.' });
    }
    if (crianca.usuarioId !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const interacao = await prisma.interaction.create({
      data: {
        criancaId,
        botao,
        duracaoSessao: duracaoSessao || null,
      },
    });

    return res.status(201).json({ interacao });
  } catch (err) {
    console.error('Erro ao registrar interação:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

async function registrarLote(req, res) {
  const { criancaId, interacoes } = req.body;

  if (!criancaId || !Array.isArray(interacoes) || interacoes.length === 0) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  try {
    const crianca = await prisma.child.findUnique({ where: { id: criancaId } });
    if (!crianca || crianca.usuarioId !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const dados = interacoes.map((i) => ({
      criancaId,
      botao: i.botao,
      timestamp: i.timestamp ? new Date(i.timestamp) : new Date(),
      duracaoSessao: i.duracaoSessao || null,
    }));

    const resultado = await prisma.interaction.createMany({ data: dados });

    return res.status(201).json({ criadas: resultado.count });
  } catch (err) {
    console.error('Erro ao registrar lote:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

async function metricas(req, res) {
  const { criancaId } = req.params;
  const dias = parseInt(req.query.dias) || 30;

  try {
    const crianca = await prisma.child.findUnique({ where: { id: criancaId } });
    if (!crianca) {
      return res.status(404).json({ error: 'Criança não encontrada.' });
    }
    if (crianca.usuarioId !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const [metricasDados, usoDiario] = await Promise.all([
      getChildMetrics(criancaId, dias),
      getDailyUsage(criancaId, dias),
    ]);

    return res.json({ metricas: metricasDados, usoDiario });
  } catch (err) {
    console.error('Erro ao buscar métricas:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

module.exports = { registrar, registrarLote, metricas };
