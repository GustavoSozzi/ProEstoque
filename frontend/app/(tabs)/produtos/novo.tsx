import { ProdutoForm } from '@/src/components/ProdutoForm';
import { Colors } from '@/src/constants/theme';
import { useProducts } from '@/src/contexts/ProductsContext';
import { ProdutoFormData } from '@/src/schemas/produtoSchema';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';

export default function NovoProdutoScreen() {
  const { adicionarProduto } = useProducts();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: ProdutoFormData) {
    setIsLoading(true);
    try {
      const { id, ...produtoSemId } = data;
      await adicionarProduto(produtoSemId);
      Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
      router.back();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível adicionar o produto');
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
