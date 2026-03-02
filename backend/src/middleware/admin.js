const prisma = require('../config/database');

async function adminMiddleware(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return res.status(403).json({ error: 'Acesso restrito a administradores.' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao verificar permissões.' });
  }
}

module.exports = adminMiddleware;
