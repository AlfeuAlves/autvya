const { Router } = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido.'),
    body('senha').isLength({ min: 8 }).withMessage('Senha deve ter ao menos 8 caracteres.'),
    body('nome').trim().notEmpty().withMessage('Nome é obrigatório.'),
    body('consentimento').isBoolean().withMessage('Consentimento é obrigatório.'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido.'),
    body('senha').notEmpty().withMessage('Senha é obrigatória.'),
  ],
  login
);

router.get('/me', authMiddleware, me);

module.exports = router;
