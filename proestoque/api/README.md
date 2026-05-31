# ProEstoque API

API REST para o sistema de gerenciamento de estoque ProEstoque.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **Zod** - Validação de schemas
- **CORS** - Habilitado para o app mobile

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor em modo desenvolvimento com hot reload
- `npm run build` - Compila o projeto para produção
- `npm start` - Inicia servidor em modo produção
- `npm run prisma:generate` - Gera o cliente Prisma
- `npm run prisma:migrate` - Executa migrations do banco
- `npm run prisma:studio` - Abre interface visual do Prisma Studio

## 📁 Estrutura do Projeto

```
api/
├── src/
│   ├── controllers/     # Lógica de negócio
│   ├── middlewares/     # Middlewares (auth, validação, etc)
│   ├── routes/          # Definição de rotas
│   ├── prisma/          # Schema e configuração do Prisma
│   └── server.ts        # Arquivo principal
├── .env                 # Variáveis de ambiente
├── package.json
└── tsconfig.json
```

## 🌐 Endpoints da API

### Produtos

- `GET /produtos` - Lista todos os produtos
- `GET /produtos/:id` - Busca produto por ID
- `POST /produtos` - Cria novo produto
- `PUT /produtos/:id` - Atualiza produto
- `DELETE /produtos/:id` - Exclui produto

### Usuários (futuro)

- `POST /auth/register` - Registra novo usuário
- `POST /auth/login` - Autentica usuário
- `GET /auth/me` - Retorna usuário autenticado

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3333
DATABASE_URL="file:./dev.db"
```

## 📝 Licença

MIT
