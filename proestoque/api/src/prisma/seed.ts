import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (opcional - cuidado em produção!)
  await prisma.produto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('🗑️  Dados antigos removidos');

  // Criar categorias
  const categorias = [
    {
      nome: 'Eletrônicos',
      descricao: 'Produtos eletrônicos e tecnologia',
    },
    {
      nome: 'Alimentos',
      descricao: 'Produtos alimentícios e bebidas',
    },
    {
      nome: 'Limpeza',
      descricao: 'Produtos de limpeza e higiene',
    },
    {
      nome: 'Ferramentas',
      descricao: 'Ferramentas e equipamentos',
    },
    {
      nome: 'Papelaria',
      descricao: 'Material de escritório e papelaria',
    },
  ];

  console.log('📦 Criando categorias...');

  for (const categoria of categorias) {
    await prisma.categoria.create({
      data: categoria,
    });
    console.log(`  ✓ ${categoria.nome}`);
  }

  // Criar usuário padrão
  console.log('👤 Criando usuário padrão...');
  
  const usuario = await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@proestoque.com',
      senha: 'admin123', // Em produção, usar hash (bcrypt)
    },
  });

  console.log(`  ✓ ${usuario.nome} (${usuario.email})`);

  // Buscar categorias criadas
  const categoriasDb = await prisma.categoria.findMany();

  // Criar alguns produtos de exemplo
  console.log('📦 Criando produtos de exemplo...');

  const produtos = [
    {
      nome: 'Notebook Dell Inspiron',
      descricao: 'Notebook Dell Inspiron 15, Intel Core i5, 8GB RAM, 256GB SSD',
      quantidade: 5,
      quantidadeMinima: 3,
      preco: 3500.0,
      unidade: 'un',
      categoriaId: categoriasDb.find((c) => c.nome === 'Eletrônicos')!.id,
      usuarioId: usuario.id,
    },
    {
      nome: 'Mouse USB Sem Fio',
      descricao: 'Mouse óptico sem fio, 1600 DPI',
      quantidade: 2,
      quantidadeMinima: 5,
      preco: 45.0,
      unidade: 'un',
      categoriaId: categoriasDb.find((c) => c.nome === 'Eletrônicos')!.id,
      usuarioId: usuario.id,
    },
    {
      nome: 'Arroz Tipo 1 5kg',
      descricao: 'Arroz branco tipo 1, pacote de 5kg',
      quantidade: 0,
      quantidadeMinima: 10,
      preco: 22.5,
      unidade: 'pct',
      categoriaId: categoriasDb.find((c) => c.nome === 'Alimentos')!.id,
      usuarioId: usuario.id,
    },
    {
      nome: 'Detergente 500ml',
      descricao: 'Detergente líquido neutro 500ml',
      quantidade: 30,
      quantidadeMinima: 10,
      preco: 3.5,
      unidade: 'un',
      categoriaId: categoriasDb.find((c) => c.nome === 'Limpeza')!.id,
      usuarioId: usuario.id,
    },
    {
      nome: 'Chave de Fenda Phillips',
      descricao: 'Chave de fenda Phillips #2, cabo emborrachado',
      quantidade: 8,
      quantidadeMinima: 5,
      preco: 15.0,
      unidade: 'un',
      categoriaId: categoriasDb.find((c) => c.nome === 'Ferramentas')!.id,
      usuarioId: usuario.id,
    },
    {
      nome: 'Resma de Papel A4',
      descricao: 'Resma de papel A4 branco, 500 folhas',
      quantidade: 3,
      quantidadeMinima: 5,
      preco: 28.0,
      unidade: 'pct',
      categoriaId: categoriasDb.find((c) => c.nome === 'Papelaria')!.id,
      usuarioId: usuario.id,
    },
  ];

  for (const produto of produtos) {
    await prisma.produto.create({
      data: produto,
    });
    console.log(`  ✓ ${produto.nome}`);
  }

  console.log('\n✅ Seed concluído com sucesso!');
  console.log(`\n📊 Resumo:`);
  console.log(`   - ${categorias.length} categorias criadas`);
  console.log(`   - 1 usuário criado`);
  console.log(`   - ${produtos.length} produtos criados`);
  console.log(`\n💡 Execute "npm run prisma:studio" para visualizar os dados`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
