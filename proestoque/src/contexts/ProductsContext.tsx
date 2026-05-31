import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Produto, PRODUTOS_MOCK } from '../data/mockData';

// ─── Types ───────────────────────────────────────────────────────────────────

type ProductsAction =
  | { type: 'LOAD'; payload: Produto[] }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string };

interface ProductsContextType {
  produtos: Produto[];
  adicionarProduto: (produto: Omit<Produto, 'id'>) => Promise<void>;
  editarProduto: (produto: Produto) => Promise<void>;
  excluirProduto: (id: string) => Promise<void>;
  buscarProdutoPorId: (id: string) => Produto | undefined;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ProductsContext = createContext<ProductsContextType | null>(null);

const STORAGE_KEY = '@proestoque:produtos';

// ─── Reducer ─────────────────────────────────────────────────────────────────

function productsReducer(state: Produto[], action: ProductsAction): Produto[] {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE':
      return state.map((p) => (p.id === action.payload.id ? action.payload : p));
    case 'DELETE':
      return state.filter((p) => p.id !== action.payload);
    default:
      return state;
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [produtos, dispatch] = useReducer(productsReducer, []);

  // Load products from AsyncStorage on mount
  useEffect(() => {
    async function loadProdutos() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          dispatch({ type: 'LOAD', payload: JSON.parse(stored) });
        } else {
          // Se não houver produtos salvos, carrega os dados mock
          dispatch({ type: 'LOAD', payload: PRODUTOS_MOCK });
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    }
    loadProdutos();
  }, []);

  // Save to AsyncStorage whenever produtos change
  useEffect(() => {
    async function saveProdutos() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
      } catch (error) {
        console.error('Erro ao salvar produtos:', error);
      }
    }
    if (produtos.length > 0) {
      saveProdutos();
    }
  }, [produtos]);

  async function adicionarProduto(produto: Omit<Produto, 'id'>) {
    const novoProduto: Produto = {
      ...produto,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD', payload: novoProduto });
  }

  async function editarProduto(produto: Produto) {
    dispatch({ type: 'UPDATE', payload: produto });
  }

  async function excluirProduto(id: string) {
    dispatch({ type: 'DELETE', payload: id });
  }

  function buscarProdutoPorId(id: string): Produto | undefined {
    return produtos.find((p) => p.id === id);
  }

  return (
    <ProductsContext.Provider
      value={{
        produtos,
        adicionarProduto,
        editarProduto,
        excluirProduto,
        buscarProdutoPorId,
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
