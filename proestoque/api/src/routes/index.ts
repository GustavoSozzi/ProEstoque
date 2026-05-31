import { Router } from 'express';
import categoriaRoutes from './categoria.routes';
import produtoRoutes from './produto.routes';

const router = Router();

// Agregador de rotas
router.use('/produtos', produtoRoutes);
router.use('/categorias', categoriaRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API ProEstoque está funcionando!',
    timestamp: new Date().toISOString(),
  });
});

export default router;
