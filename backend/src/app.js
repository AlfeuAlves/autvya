require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const childrenRoutes = require('./routes/children.routes');
const interactionsRoutes = require('./routes/interactions.routes');
const aiRoutes = require('./routes/ai.routes');
const reportsRoutes = require('./routes/reports.routes');

const app = express();

// Segurança
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Logs
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/children', childrenRoutes);
app.use('/api/v1/interactions', interactionsRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/reports', reportsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

module.exports = app;
