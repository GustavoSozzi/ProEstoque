import { ProdutoForm } from '@/src/components/ProdutoForm';
import { Colors } from '@/src/constants/theme';
import { useProducts } from '@/src/contexts/ProductsContext';
import { ProdutoFormData } from '@/src/schemas/produtoSchema';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function NovoProdutoScreen() {
  const { adicionarProduto } = useProducts();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: ProdutoFormData) {
    setIsLoading(true);
    try {
      const { id, ...produtoSemId } = data;
      await adicionarProduto(produtoSemId);
      router.back();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProdutoForm onSubmit={handleSubmit} submitLabel="Adicionar Produto" isLoading={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
});
