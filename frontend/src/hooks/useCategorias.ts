import { useEffect, useState } from 'react';
import api from '../services/api';

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
}

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarCategorias = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar categorias';
      setError(message);
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  return {
    categorias,
    isLoading,
    error,
    refetch: carregarCategorias,
  };
}
