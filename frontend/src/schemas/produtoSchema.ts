import { z } from 'zod';

export const produtoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, 'Nome é obrigatório').trim(),
  categoriaId: z.string().min(1, 'Categoria é obrigatória'),
  descricao: z.string().optional(),
  quantidade: z.number({
    required_error: 'Quantidade é obrigatória',
    invalid_type_error: 'Quantidade deve ser um número',
  }).min(0, 'Quantidade deve ser maior ou igual a 0'),
  quantidadeMinima: z.number({
    required_error: 'Quantidade mínima é obrigatória',
    invalid_type_error: 'Quantidade mínima deve ser um número',
  }).min(0, 'Quantidade mínima deve ser maior ou igual a 0'),
  preco: z.number({
    required_error: 'Preço é obrigatório',
    invalid_type_error: 'Preço deve ser um número',
  }).min(0.01, 'Preço deve ser maior que zero'),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
