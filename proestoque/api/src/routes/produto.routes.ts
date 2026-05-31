import { Router } from 'express';
import { ProdutoController } from '../controllers/produto.controller';

const router = Router();
const produtoController = new ProdutoController();

// Rotas de produtos
router.get('/', produtoController.listar.bind(produtoController));
router.get('/:id', produtoController.buscarPorId.bind(produtoController));
router.post('/', produtoController.criar.bind(produtoController));
router.put('/:id', produtoController.atualizar.bind(produtoController));
router.delete('/:id', produtoController.deletar.bind(produtoController));

export default router;
