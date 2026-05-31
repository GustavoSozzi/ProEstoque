# 🚀 Setup da API ProEstoque

Siga estes passos para configurar e rodar a API:

## 1️⃣ Instalar Dependências

```bash
cd api
npm install
```

## 2️⃣ Inicializar o Prisma (já feito)

O Prisma já foi inicializado com SQLite. O arquivo `prisma/schema.prisma` contém:
- ✅ Model `Categoria`
- ✅ Model `Produto`
- ✅ Model `Usuario`
- ✅ Relações entre os modelos

## 3️⃣ Gerar o Cliente Prisma

```bash
npm run prisma:generate
```

## 4️⃣ Criar o Banco de Dados

```bash
npx prisma migrate dev --name init
```

Isso vai:
- Criar o arquivo `prisma/dev.db` (banco SQLite)
- Criar as tabelas no banco
- Aplicar a migration inicial

## 5️⃣ Popular o Banco (Seed)

```bash
npm run prisma:seed
```

Isso vai criar:
- ✅ 5 categorias (Eletrônicos, Alimentos, Limpeza, Ferramentas, Papelaria)
- ✅ 1 usuário padrão (admin@proestoque.com)
- ✅ 6 produtos de exemplo

## 6️⃣ Verificar os Dados

```bash
npm run prisma:studio
```

Isso abre o Prisma Studio no navegador (http://localhost:5555) onde você pode:
- Ver todas as tabelas
- Ver os dados inseridos
- Editar dados manualmente
- Testar queries

## 7️⃣ Iniciar o Servidor (próximo passo)

Após criar as rotas e controllers:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3333`

---

## 📊 Estrutura do Banco

### Tabela: categorias
- `id` (UUID)
- `nome` (String, único)
- `descricao` (String, opcional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Tabela: produtos
- `id` (UUID)
- `nome` (String)
- `descricao` (String, opcional)
- `quantidade` (Float)
- `quantidadeMinima` (Float)
- `preco` (Float)
- `unidade` (String)
- `categoriaId` (UUID, FK)
- `usuarioId` (UUID, FK)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Tabela: usuarios
- `id` (UUID)
- `nome` (String)
- `email` (String, único)
- `senha` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

---

## 🔧 Comandos Úteis

```bash
# Ver logs do Prisma
npx prisma studio

# Resetar banco (cuidado!)
npx prisma migrate reset

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Formatar schema
npx prisma format
```

---

## ✅ Checklist

- [ ] Dependências instaladas (`npm install`)
- [ ] Cliente Prisma gerado (`npm run prisma:generate`)
- [ ] Migration executada (`npx prisma migrate dev --name init`)
- [ ] Banco `dev.db` criado
- [ ] Seed executado (`npm run prisma:seed`)
- [ ] Dados verificados no Prisma Studio (`npm run prisma:studio`)

Após completar todos os itens, você está pronto para criar as rotas e controllers! 🎉
