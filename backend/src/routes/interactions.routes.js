const { Router } = require('express');
const { body } = require('express-validator');
const { registrar, registrarLote, metricas } = require('../controllers/interactions.controller');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  [
    body('criancaId').notEmpty().withMessage('criancaId é obrigatório.'),
    body('botao').trim().notEmpty().withMessage('botao é obrigatório.'),
    body('duracaoSessao').optional().isInt({ min: 0 }),
  ],
  registrar
);

router.post('/lote', registrarLote);

router.get('/:criancaId/metrics', metricas);

module.exports = router;
