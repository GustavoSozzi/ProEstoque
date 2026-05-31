import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

// ─── App Configuration ───────────────────────────────────────────────────────

const app = express();

// ─── Middlewares ─────────────────────────────────────────────────────────────

// CORS - Permitir requisições do app mobile
app.use(
  cors({
    origin: '*', // Em produção, especificar domínios permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON
app.use(express.json());

// Parse URL-encoded
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API ProEstoque',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      produtos: '/api/produtos',
      categorias: '/api/categorias',
    },
  });
});

// Rotas da API sob /api
app.use('/api', routes);

// ─── Error Handler ───────────────────────────────────────────────────────────

app.use(errorHandler);

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada',
  });
});

export default app;
