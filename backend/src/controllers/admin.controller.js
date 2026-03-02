const prisma = require('../config/database');

// GET /api/v1/admin/users — lista todos os usuários com filhos e métricas
async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      where: { isAdmin: false },
      orderBy: { criadoEm: 'desc' },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
        filhos: {
          select: {
            id: true,
            nome: true,
            idade: true,
            fase: true,
            criadoEm: true,
            _count: { select: { interacoes: true } },
          },
          orderBy: { criadoEm: 'asc' },
        },
      },
    });

    const resumo = {
      totalUsuarios: users.length,
      totalCriancas: users.reduce((acc, u) => acc + u.filhos.length, 0),
      totalInteracoes: users.reduce(
        (acc, u) => acc + u.filhos.reduce((a, f) => a + f._count.interacoes, 0),
        0
      ),
    };

    return res.json({ resumo, usuarios: users });
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

// POST /api/v1/admin/setup — define um usuário como admin (protegido por secret)
async function setupAdmin(req, res) {
  const { email, secret } = req.body;

  if (secret !== process.env.ADMIN_SETUP_SECRET) {
    return res.status(403).json({ error: 'Secret inválido.' });
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
      select: { id: true, email: true, nome: true, isAdmin: true },
    });
    return res.json({ mensagem: `${user.nome} agora é administrador.`, user });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

module.exports = { getUsers, setupAdmin };
