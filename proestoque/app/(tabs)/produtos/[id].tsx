import { Button } from '@/src/components/Button';
import { ProdutoForm } from '@/src/components/ProdutoForm';
import { Colors, Radius, Spacing, Typography } from '@/src/constants/theme';
import { useProducts } from '@/src/contexts/ProductsContext';
import { ProdutoFormData } from '@/src/schemas/produtoSchema';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscarProdutoPorId, editarProduto, excluirProduto } = useProducts();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const produto = buscarProdutoPorId(id!);

  if (!produto) {
    return null;
  }

  async function handleSubmit(data: ProdutoFormData) {
    setIsLoading(true);
    try {
      await editarProduto({ ...data, id: id! });
      router.back();
    } catch (error) {
      console.error('Erro ao editar produto:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDelete() {
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    excluirProduto(id!);
    setShowDeleteModal(false);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ProdutoForm
          defaultValues={produto}
          onSubmit={handleSubmit}
          submitLabel="Salvar Alterações"
          isLoading={isLoading}
        />
        <Button
          title="Excluir Produto"
          variant="outline"
          iconName="trash-2"
          onPress={handleDelete}
          style={styles.deleteButton}
        />
      </View>

      {/* Modal de Confirmação */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Excluir Produto</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja excluir "{produto.nome}"?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButtonModal]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
  content: {
    flex: 1,
  },
  deleteButton: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[4],
    borderColor: Colors.danger.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[4],
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[6],
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
  },
  modalMessage: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing[6],
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing[3],
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  deleteButtonModal: {
    backgroundColor: Colors.danger.text,
  },
  deleteButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
});
