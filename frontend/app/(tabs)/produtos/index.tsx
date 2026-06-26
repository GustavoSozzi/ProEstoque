import { Colors, Radius, Spacing, Typography } from '@/src/constants/theme';
import { useProducts } from '@/src/contexts/ProductsContext';
import { useCategorias } from '@/src/hooks/useCategorias';
import { LoadingView } from '@/src/components/LoadingView';
import { ErrorView } from '@/src/components/ErrorView';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type StatusEstoque = 'normal' | 'baixo' | 'sem_estoque';

function getStatus(quantidade: number, quantidadeMinima: number): StatusEstoque {
  if (quantidade === 0) return 'sem_estoque';
  if (quantidade <= quantidadeMinima) return 'baixo';
  return 'normal';
}

function StatusBadge({ status }: { status: StatusEstoque }) {
  const config = {
    normal: { label: 'Normal', bg: Colors.success.bg, color: Colors.success.text },
    baixo: { label: 'Baixo', bg: Colors.warning.bg, color: Colors.warning.text },
    sem_estoque: { label: 'Sem estoque', bg: Colors.danger.bg, color: Colors.danger.text },
  }[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

function ProdutoItem({ produto, onPress }: { produto: any; onPress: () => void }) {
  const status = getStatus(produto.quantidade, produto.quantidadeMinima);
  return (
    <TouchableOpacity style={styles.produtoCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{produto.nome}</Text>
        <Text style={styles.produtoCategoria}>{produto.categoria?.nome || 'Sem categoria'}</Text>
      </View>
      <View style={styles.produtoRight}>
        <Text style={styles.produtoPreco}>
          {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Text>
        <Text style={styles.produtoQuantidade}>
          {produto.quantidade} {produto.unidade}
        </Text>
        <StatusBadge status={status} />
      </View>
    </TouchableOpacity>
  );
}

export default function ProdutosScreen() {
  const { produtos, isLoading, error, carregarProdutos } = useProducts();
  const { categorias } = useCategorias();
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  };

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria = categoriaAtiva === 'Todas' || p.categoria?.nome === categoriaAtiva;
      return matchBusca && matchCategoria;
    });
  }, [produtos, busca, categoriaAtiva]);

  const todasCategorias = ['Todas', ...categorias.map(c => c.nome)];

  if (isLoading && produtos.length === 0) {
    return <LoadingView message="Carregando produtos..." />;
  }

  if (error && produtos.length === 0) {
    return <ErrorView message={error} onRetry={carregarProdutos} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.appBackground} />

      <View style={styles.header}>
        <Text style={styles.titulo}>Produtos</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor={Colors.textSecondary}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={todasCategorias}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, categoriaAtiva === item && styles.chipAtivo]}
              onPress={() => setCategoriaAtiva(item)}
            >
              <Text style={[styles.chipText, categoriaAtiva === item && styles.chipTextAtivo]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chipsContainer}
        />
      </View>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProdutoItem produto={item} onPress={() => router.push(`/produtos/${item.id}`)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary[500]]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTexto}>Nenhum produto encontrado</Text>
            <Text style={styles.emptySubtexto}>
              {produtos.length === 0
                ? 'Adicione seu primeiro produto'
                : 'Tente outro termo ou categoria'}
            </Text>
          </View>
        }
      />

      {/* FAB - Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/produtos/novo')}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={24} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
  header: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[3],
  },
  titulo: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing[3],
  },
  chipsContainer: {
    gap: Spacing[2],
    paddingBottom: Spacing[1],
  },
  chip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipAtivo: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextAtivo: {
    color: Colors.white,
  },
  listContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[8],
    flexGrow: 1,
  },
  produtoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginBottom: Spacing[2],
    borderRadius: Radius.md,
    padding: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  produtoCategoria: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  produtoRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  produtoPreco: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[500],
  },
  produtoQuantidade: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  badge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing[16],
  },
  emptyTexto: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  emptySubtexto: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: Spacing[4],
    bottom: Spacing[4],
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
