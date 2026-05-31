import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller';

const router = Router();
const categoriaController = new CategoriaController();

// Rotas de categorias
router.get('/', categoriaController.listar.bind(categoriaController));
router.get('/:id', categoriaController.buscarPorId.bind(categoriaController));

export default router;
