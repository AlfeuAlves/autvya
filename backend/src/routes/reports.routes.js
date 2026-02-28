const { Router } = require('express');
const { relatorio, resumoGeral } = require('../controllers/reports.controller');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.use(authMiddleware);

router.get('/resumo', resumoGeral);
router.get('/:criancaId', relatorio);

module.exports = router;
