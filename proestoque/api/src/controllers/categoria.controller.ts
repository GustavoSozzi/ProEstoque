import { NextFunction, Request, Response } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { prisma } from '../prisma/client';

// ─── Controller ──────────────────────────────────────────────────────────────

export class CategoriaController {
  // GET /api/categorias
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const categorias = await prisma.categoria.findMany({
        include: {
          _count: {
            select: {
              produtos: true,
            },
          },
        },
        orderBy: {
          nome: 'asc',
        },
      });

      return res.json(categorias);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/categorias/:id
  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const categoria = await prisma.categoria.findUnique({
        where: { id },
        include: {
          produtos: {
            orderBy: {
              nome: 'asc',
            },
          },
          _count: {
            select: {
              produtos: true,
            },
          },
        },
      });

      if (!categoria) {
        throw new AppError('Categoria não encontrada', 404);
      }

      return res.json(categoria);
    } catch (error) {
      next(error);
    }
  }
}
