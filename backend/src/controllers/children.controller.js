const { validationResult } = require('express-validator');
const prisma = require('../config/database');

async function listar(req, res) {
  try {
    const filhos = await prisma.child.findMany({
      where: { usuarioId: req.userId },
      orderBy: { criadoEm: 'asc' },
      include: {
        _count: { select: { interacoes: true } },
      },
    });

    return res.json({ filhos });
  } catch (err) {
    console.error('Erro ao listar crianças:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

async function buscar(req, res) {
  const { id } = req.params;

  try {
    const crianca = await prisma.child.findUnique({
      where: { id },
      include: {
        _count: { select: { interacoes: true } },
      },
    });

    if (!crianca) {
      return res.status(404).json({ error: 'Criança não encontrada.' });
    }

    if (crianca.usuarioId !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    return res.json({ crianca });
  } catch (err) {
    console.error('Erro ao buscar criança:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

async function criar(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nome, idade, configuracoes } = req.body;

  try {
    const crianca = await prisma.child.create({
      data: {
        nome,
        idade,
        usuarioId: req.userId,
        configuracoes: configuracoes || {},
      },
    });

    return res.status(201).json({ crianca });
  } catch (err) {
    console.error('Erro ao criar criança:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

async function atualizar(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { nome, idade, fase, configuracoes } = req.body;

  try {
    const crianca = await prisma.child.findUnique({ where: { id } });

    if (!crianca) {
      return res.status(404).json({ error: 'Criança não encontrada.' });
    }

    if (crianca.usuarioId !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const atualizada = await prisma.child.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(idade && { idade }),
        ...(fase && { fase }),
        ...(configuracoes && { configuracoes }),
      },
    });

    return res.json({ crianca: atualizada });
  } catch (err) {
    console.error('Erro ao atualizar criança:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

async function deletar(req, res) {
  const { id } = req.params;

  try {
    const crianca = await prisma.child.findUnique({ where: { id } });

    if (!crianca) {
      return res.status(404).json({ error: 'Criança não encontrada.' });
    }

    if (crianca.usuarioId !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    await prisma.child.delete({ where: { id } });

    return res.json({ message: 'Perfil removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar criança:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

module.exports = { listar, buscar, criar, atualizar, deletar };
