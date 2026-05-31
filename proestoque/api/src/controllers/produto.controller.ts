import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler';
import { prisma } from '../prisma/client';

// ─── Schema de Validação ─────────────────────────────────────────────────────

const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  quantidade: z.number().min(0, 'Quantidade deve ser maior ou igual a 0'),
  quantidadeMinima: z.number().min(0, 'Quantidade mínima deve ser maior ou igual a 0'),
  preco: z.number().min(0.01, 'Preço deve ser maior que zero'),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  categoriaId: z.string().uuid('ID da categoria inválido'),
  usuarioId: z.string().uuid('ID do usuário inválido'),
});

// ─── Controller ──────────────────────────────────────────────────────────────

export class ProdutoController {
  // GET /api/produtos
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const produtos = await prisma.produto.findMany({
        include: {
          categoria: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.json(produtos);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/produtos/:id
  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const produto = await prisma.produto.findUnique({
        where: { id },
        include: {
          categoria: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      if (!produto) {
        throw new AppError('Produto não encontrado', 404);
      }

      return res.json(produto);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/produtos
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = produtoSchema.parse(req.body);

      // Verificar se categoria existe
      const categoria = await prisma.categoria.findUnique({
        where: { id: data.categoriaId },
      });

      if (!categoria) {
        throw new AppError('Categoria não encontrada', 404);
      }

      // Verificar se usuário existe
      const usuario = await prisma.usuario.findUnique({
        where: { id: data.usuarioId },
      });

      if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
      }

      const produto = await prisma.produto.create({
        data,
        include: {
          categoria: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      return res.status(201).json(produto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Erro de validação',
          errors: error.errors,
        });
      }
      next(error);
    }
  }

  // PUT /api/produtos/:id
  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = produtoSchema.partial().parse(req.body);

      // Verificar se produto existe
      const produtoExiste = await prisma.produto.findUnique({
        where: { id },
      });

      if (!produtoExiste) {
        throw new AppError('Produto não encontrado', 404);
      }

      // Se categoriaId foi fornecido, verificar se existe
      if (data.categoriaId) {
        const categoria = await prisma.categoria.findUnique({
          where: { id: data.categoriaId },
        });

        if (!categoria) {
          throw new AppError('Categoria não encontrada', 404);
        }
      }

      const produto = await prisma.produto.update({
        where: { id },
        data,
        include: {
          categoria: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      return res.json(produto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Erro de validação',
          errors: error.errors,
        });
      }
      next(error);
    }
  }

  // DELETE /api/produtos/:id
  async deletar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Verificar se produto existe
      const produto = await prisma.produto.findUnique({
        where: { id },
      });

      if (!produto) {
        throw new AppError('Produto não encontrado', 404);
      }

      await prisma.produto.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
