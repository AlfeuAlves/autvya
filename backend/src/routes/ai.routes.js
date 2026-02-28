const { Router } = require('express');
const { analise } = require('../controllers/ai.controller');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.use(authMiddleware);

router.post('/analise', analise);

module.exports = router;
