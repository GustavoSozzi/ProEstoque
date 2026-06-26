import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
  categoriaId: string;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
  categoria?: {
    id: string;
    nome: string;
  };
}

interface ProductsContextType {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
  adicionarProduto: (produto: Omit<Produto, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  editarProduto: (id: string, produto: Partial<Omit<Produto, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  excluirProduto: (id: string) => Promise<void>;
  buscarProdutoPorId: (id: string) => Produto | undefined;
  carregarProdutos: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ProductsContext = createContext<ProductsContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Carregar produtos da API
  const carregarProdutos = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar produtos';
      setError(message);
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar produtos quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      carregarProdutos();
    } else {
      setProdutos([]);
    }
  }, [isAuthenticated]);

  async function adicionarProduto(produto: Omit<Produto, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>) {
    try {
      setError(null);
      const response = await api.post('/produtos', produto);
      setProdutos((prev) => [...prev, response.data]);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao adicionar produto';
      setError(message);
      throw new Error(message);
    }
  }

  async function editarProduto(id: string, produto: Partial<Omit<Produto, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>>) {
    try {
      setError(null);
      const response = await api.put(`/produtos/${id}`, produto);
      setProdutos((prev) => prev.map((p) => (p.id === id ? response.data : p)));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao editar produto';
      setError(message);
      throw new Error(message);
    }
  }

  async function excluirProduto(id: string) {
    try {
      setError(null);
      await api.delete(`/produtos/${id}`);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao excluir produto';
      setError(message);
      throw new Error(message);
    }
  }

  function buscarProdutoPorId(id: string): Produto | undefined {
    return produtos.find((p) => p.id === id);
  }

  return (
    <ProductsContext.Provider
      value={{
        produtos,
        isLoading,
        error,
        adicionarProduto,
        editarProduto,
        excluirProduto,
        buscarProdutoPorId,
        carregarProdutos,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useProducts(): ProductsContextType {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return ctx;
}

