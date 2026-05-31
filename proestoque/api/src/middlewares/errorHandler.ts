import { NextFunction, Request, Response } from 'express';

// ─── Classe de Erro Customizada ─────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 400, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Middleware de Tratamento de Erros ──────────────────────────────────────

export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Se for um AppError, usa o statusCode definido
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  // Erros do Prisma
  if (error.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      status: 'error',
      message: 'Erro ao processar requisição no banco de dados',
    });
  }

  // Erros de validação do Zod
  if (error.name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      message: 'Erro de validação',
      errors: error,
    });
  }

  // Log do erro para debug (em produção, usar logger apropriado)
  console.error('❌ Erro não tratado:', error);

  // Erro genérico
  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
}
