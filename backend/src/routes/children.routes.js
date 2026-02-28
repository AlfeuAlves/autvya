const { Router } = require('express');
const { body } = require('express-validator');
const { listar, buscar, criar, atualizar, deletar } = require('../controllers/children.controller');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.use(authMiddleware);

router.get('/', listar);
router.get('/:id', buscar);

router.post(
  '/',
  [
    body('nome').trim().notEmpty().withMessage('Nome é obrigatório.'),
    body('idade').isInt({ min: 1, max: 18 }).withMessage('Idade deve ser entre 1 e 18.'),
  ],
  criar
);

router.put(
  '/:id',
  [
    body('nome').optional().trim().notEmpty().withMessage('Nome não pode ser vazio.'),
    body('idade').optional().isInt({ min: 1, max: 18 }).withMessage('Idade inválida.'),
    body('fase')
      .optional()
      .isIn(['CONEXAO', 'ESCOLHA', 'COMUNICACAO'])
      .withMessage('Fase inválida.'),
  ],
  atualizar
);

router.delete('/:id', deletar);

module.exports = router;
