const express = require('express');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { getUsers, setupAdmin } = require('../controllers/admin.controller');

const router = express.Router();

// Setup inicial — não exige auth, apenas secret no body
router.post('/setup', setupAdmin);

// Rotas protegidas — exige auth + isAdmin
router.use(authMiddleware, adminMiddleware);
router.get('/users', getUsers);

module.exports = router;
