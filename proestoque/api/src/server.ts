import app from './app';
import { prisma } from './prisma/client';

// ─── Configuration ───────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3333;

// ─── Database Connection ─────────────────────────────────────────────────────

async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
}

// ─── Server Start ────────────────────────────────────────────────────────────

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📍 http://localhost:${PORT}/api/health\n`);
  });
}

// ─── Graceful Shutdown ───────────────────────────────────────────────────────

process.on('SIGINT', async () => {
  console.log('\n⏳ Encerrando servidor...');
  await prisma.$disconnect();
  console.log('✅ Desconectado do banco de dados');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏳ Encerrando servidor...');
  await prisma.$disconnect();
  console.log('✅ Desconectado do banco de dados');
  process.exit(0);
});

// ─── Start ───────────────────────────────────────────────────────────────────

startServer();
