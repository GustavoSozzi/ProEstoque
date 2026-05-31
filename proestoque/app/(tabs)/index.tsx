import { Colors, Radius, Spacing, Typography } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';
import { useProducts } from '@/src/contexts/ProductsContext';
import { Produto, StatusEstoque, getStatus } from '@/src/data/mockData';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSaudacao(): string {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getDataHoje(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function getInicial(nome: string): string {
  return nome.trim().charAt(0).toUpperCase();
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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

function ProdutoItem({ produto }: { produto: Produto }) {
  const status = getStatus(produto);
  return (
    <View style={styles.produtoCard}>
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{produto.nome}</Text>
        <Text style={styles.produtoCategoria}>{produto.categoria}</Text>
      </View>
      <View style={styles.produtoRight}>
        <Text style={styles.produtoQuantidade}>
          {produto.quantidade} {produto.unidade}
        </Text>
        <StatusBadge status={status} />
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function DashboardHome() {
  const { user } = useAuth();
  const { produtos } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  const [busca, setBusca] = useState('');

  const nomeUsuario = user?.nome ?? 'Usuário';
  const inicial = getInicial(nomeUsuario);

  // Filtrar produtos pela busca
  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const produtosAlerta = produtosFiltrados.filter((p) => getStatus(p) !== 'normal');
  const totalProdutos = produtos.length;
  const totalAlertas = produtos.filter((p) => getStatus(p) !== 'normal').length;
  const totalCategorias = new Set(produtos.map((p) => p.categoria)).size;
  const valorTotal = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);

  const cards = [
    { titulo: 'Total', valor: totalProdutos, cor: Colors.primary[500] },
    { titulo: 'Alertas', valor: totalAlertas, cor: Colors.danger.text },
    { titulo: 'Categorias', valor: totalCategorias, cor: Colors.secondary[500] },
    {
      titulo: 'Valor Total',
      valor: valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      cor: Colors.success.text,
    },
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const ListHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              {getSaudacao()}, {nomeUsuario} 👋
            </Text>
            <Text style={styles.date}>{getDataHoje()}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{inicial}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardsGrid}>
        {cards.map((card, i) => (
          <View key={i} style={styles.card}>
            <Text style={[styles.cardValor, { color: card.cor }]}>{card.valor}</Text>
            <Text style={styles.cardTitulo}>{card.titulo}</Text>
          </View>
        ))}
      </View>

      {produtosAlerta.length > 0 && (
        <View style={styles.alertasSection}>
          <Text style={styles.alertasTitulo}>Alertas de Estoque Crítico</Text>
          {produtosAlerta.map((p) => (
            <View key={p.id} style={styles.alertaItem}>
              <View style={styles.alertaDot} />
              <Text style={styles.alertaNome}>{p.nome}</Text>
              <Text style={styles.alertaQtd}>
                {p.quantidade} {p.unidade}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor={Colors.textSecondary}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Text style={styles.sectionTitle}>
        {busca ? `Resultados (${produtosFiltrados.length})` : 'Produtos Recentes'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.appBackground} />
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProdutoItem produto={item} />}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary[500]]}
            tintColor={Colors.primary[500]}
          />
        }
        ListEmptyComponent={
          busca ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
              <Text style={styles.emptySubtext}>Tente outro termo de busca</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
  listContent: {
    paddingBottom: Spacing[8],
  },
  header: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[4],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  date: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing[1],
    textTransform: 'capitalize',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing[3],
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing[3],
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  card: {
    width: '47.5%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardValor: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing[1],
  },
  cardTitulo: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  alertasSection: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[4],
    backgroundColor: Colors.danger.bg,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.danger.border,
  },
  alertasTitulo: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.danger.text,
    marginBottom: Spacing[2],
  },
  alertaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  alertaDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.danger.text,
    marginRight: Spacing[2],
  },
  alertaNome: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.danger.text,
  },
  alertaQtd: {
    fontSize: Typography.fontSize.sm,
    color: Colors.danger.text,
    fontWeight: Typography.fontWeight.semibold,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[3],
  },
  searchContainer: {
    paddingHorizontal: Spacing[4],
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
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[8],
  },
  emptyText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[1],
  },
  emptySubtext: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  produtoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing[4],
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
    gap: Spacing[1],
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
});
