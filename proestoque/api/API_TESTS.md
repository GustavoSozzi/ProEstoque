# 🧪 Testes da API ProEstoque

## 🚀 Iniciar o Servidor

```bash
cd api
npm run dev
```

Você deve ver:
```
✅ Conectado ao banco de dados
🚀 Servidor rodando na porta 3333
📍 http://localhost:3333
📍 http://localhost:3333/api/health
```

---

## 📋 Endpoints Disponíveis

### Health Check

```bash
# GET /api/health
curl http://localhost:3333/api/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "API ProEstoque está funcionando!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Categorias

#### Listar todas as categorias

```bash
# GET /api/categorias
curl http://localhost:3333/api/categorias
```

#### Buscar categoria por ID

```bash
# GET /api/categorias/:id
curl http://localhost:3333/api/categorias/{id}
```

---

### Produtos

#### Listar todos os produtos

```bash
# GET /api/produtos
curl http://localhost:3333/api/produtos
```

#### Buscar produto por ID

```bash
# GET /api/produtos/:id
curl http://localhost:3333/api/produtos/{id}
```

#### Criar novo produto

```bash
# POST /api/produtos
curl -X POST http://localhost:3333/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teclado Mecânico",
    "descricao": "Teclado mecânico RGB",
    "quantidade": 10,
    "quantidadeMinima": 5,
    "preco": 250.00,
    "unidade": "un",
    "categoriaId": "{id_da_categoria}",
    "usuarioId": "{id_do_usuario}"
  }'
```

#### Atualizar produto

```bash
# PUT /api/produtos/:id
curl -X PUT http://localhost:3333/api/produtos/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "quantidade": 15,
    "preco": 230.00
  }'
```

#### Deletar produto

```bash
# DELETE /api/produtos/:id
curl -X DELETE http://localhost:3333/api/produtos/{id}
```

---

## 🧪 Testando com Postman/Insomnia

### 1. Importar Collection

Crie uma collection com os seguintes requests:

**Base URL:** `http://localhost:3333/api`

### 2. Testar Fluxo Completo

1. **GET /categorias** - Pegar ID de uma categoria
2. **GET /produtos** - Ver produtos existentes
3. **POST /produtos** - Criar novo produto
4. **GET /produtos/:id** - Buscar o produto criado
5. **PUT /produtos/:id** - Atualizar o produto
6. **DELETE /produtos/:id** - Deletar o produto

---

## ✅ Validações Implementadas

### Produto

- ✅ Nome obrigatório (mínimo 1 caractere)
- ✅ Quantidade >= 0
- ✅ Quantidade mínima >= 0
- ✅ Preço > 0
- ✅ Unidade obrigatória
- ✅ CategoriaId deve ser UUID válido
- ✅ UsuarioId deve ser UUID válido
- ✅ Categoria deve existir
- ✅ Usuário deve existir

### Respostas de Erro

**404 - Not Found:**
```json
{
  "status": "error",
  "message": "Produto não encontrado"
}
```

**400 - Validation Error:**
```json
{
  "status": "error",
  "message": "Erro de validação",
  "errors": [...]
}
```

**500 - Internal Server Error:**
```json
{
  "status": "error",
  "message": "Erro interno do servidor"
}
```

---

## 🔍 Verificar Dados no Prisma Studio

```bash
npm run prisma:studio
```

Abre em: `http://localhost:5555`

---

## 📊 Estrutura de Resposta

### Produto Completo

```json
{
  "id": "uuid",
  "nome": "Notebook Dell",
  "descricao": "Notebook Dell Inspiron",
  "quantidade": 5,
  "quantidadeMinima": 3,
  "preco": 3500.00,
  "unidade": "un",
  "categoriaId": "uuid",
  "usuarioId": "uuid",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z",
  "categoria": {
    "id": "uuid",
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos"
  },
  "usuario": {
    "id": "uuid",
    "nome": "Administrador",
    "email": "admin@proestoque.com"
  }
}
```

### Categoria com Contagem

```json
{
  "id": "uuid",
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z",
  "_count": {
    "produtos": 5
  }
}
```
