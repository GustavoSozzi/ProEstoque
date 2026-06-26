export type StatusEstoque = 'normal' | 'baixo' | 'sem_estoque';

export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
}

export function getStatus(produto: Produto): StatusEstoque {
  if (produto.quantidade === 0) return 'sem_estoque';
  if (produto.quantidade <= produto.quantidadeMinima) return 'baixo';
  return 'normal';
}

export const CATEGORIAS = [
  'Todas',
  'Eletrônicos',
  'Alimentos',
  'Limpeza',
  'Ferramentas',
  'Papelaria',
];

export const PRODUTOS_MOCK: Produto[] = [
  {
    id: '1',
    nome: 'Notebook Dell Inspiron',
    categoria: 'Eletrônicos',
    quantidade: 5,
    quantidadeMinima: 3,
    preco: 3500.0,
    unidade: 'un',
  },
  {
    id: '2',
    nome: 'Mouse USB Sem Fio',
    categoria: 'Eletrônicos',
    quantidade: 2,
    quantidadeMinima: 5,
    preco: 45.0,
    unidade: 'un',
  },
  {
    id: '3',
    nome: 'Arroz Tipo 1 5kg',
    categoria: 'Alimentos',
    quantidade: 0,
    quantidadeMinima: 10,
    preco: 22.5,
    unidade: 'pct',
  },
  {
    id: '4',
    nome: 'Detergente 500ml',
    categoria: 'Limpeza',
    quantidade: 30,
    quantidadeMinima: 10,
    preco: 3.5,
    unidade: 'un',
  },
  {
    id: '5',
    nome: 'Chave de Fenda Phillips',
    categoria: 'Ferramentas',
    quantidade: 8,
    quantidadeMinima: 5,
    preco: 15.0,
    unidade: 'un',
  },
  {
    id: '6',
    nome: 'Resma de Papel A4',
    categoria: 'Papelaria',
    quantidade: 3,
    quantidadeMinima: 5,
    preco: 28.0,
    unidade: 'pct',
  },
  {
    id: '7',
    nome: 'Teclado Mecânico RGB',
    categoria: 'Eletrônicos',
    quantidade: 0,
    quantidadeMinima: 2,
    preco: 280.0,
    unidade: 'un',
  },
  {
    id: '8',
    nome: 'Sabão em Pó 1kg',
    categoria: 'Limpeza',
    quantidade: 15,
    quantidadeMinima: 8,
    preco: 12.0,
    unidade: 'kg',
  },
  {
    id: '9',
    nome: 'Caneta Esferográfica Azul',
    categoria: 'Papelaria',
    quantidade: 50,
    quantidadeMinima: 20,
    preco: 1.5,
    unidade: 'un',
  },
  {
    id: '10',
    nome: 'Alicate Universal 8"',
    categoria: 'Ferramentas',
    quantidade: 2,
    quantidadeMinima: 3,
    preco: 35.0,
    unidade: 'un',
  },
  {
    id: '11',
    nome: 'Monitor 24" Full HD',
    categoria: 'Eletrônicos',
    quantidade: 4,
    quantidadeMinima: 2,
    preco: 950.0,
    unidade: 'un',
  },
  {
    id: '12',
    nome: 'Feijão Carioca 1kg',
    categoria: 'Alimentos',
    quantidade: 1,
    quantidadeMinima: 5,
    preco: 8.9,
    unidade: 'pct',
  },
];
