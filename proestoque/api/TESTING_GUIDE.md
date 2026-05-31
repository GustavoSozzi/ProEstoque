# 🧪 Guia de Testes - Thunder Client

## 📋 Pré-requisitos

1. **Instalar Thunder Client no VS Code**
   - Abra o VS Code
   - Vá em Extensions (Ctrl+Shift+X)
   - Busque por "Thunder Client"
   - Clique em "Install"

2. **Servidor rodando**
   ```bash
   cd api
   npm run dev
   ```

3. **Banco populado com seed**
   ```bash
   npm run prisma:seed
   ```

---

## 🚀 Setup Inicial

### 1. Obter IDs necessários

Primeiro, precisamos pegar os IDs de categoria e usuário para usar nos testes.

**Abra o Prisma Studio:**
```bash
npm run prisma:studio
```

**Copie:**
- Um `id` da tabela `categorias` (ex: Eletrônicos)
- O `id` da tabela `usuarios` (admin@proestoque.com)

### 2. Configurar Variáveis de Ambiente no Thunder Client

1. Abra Thunder Client no VS Code (ícone de raio na barra lateral)
2. Clique em "Env" (Environments)
3. Crie um novo ambiente chamado "Local"
4. Adicione as variáveis:

```json
{
  "categoriaId": "cole-o-id-da-categoria-aqui",
  "usuarioId": "cole-o-id-do-usuario-aqui",
  "produtoId": ""
}
```

**Nota:** O `produtoId` será preenchido automaticamente pelo teste 3.

---

## ✅ Checklist de Testes

Execute os testes na ordem abaixo:

### ✅ Teste 1: GET /api/produtos - Listar todos

**Request:**
```
GET http://localhost:3333/api/produtos
```

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Body: Array de produtos
- ✅ Cada produto tem: id, nome, quantidade, preco, categoria, usuario

**Como testar:**
1. No Thunder Client, clique em "New Request"
2. Método: GET
3. URL: `http://localhost:3333/api/produtos`
4. Clique em "Send"

---

### ✅ Teste 2: GET /api/categorias - Listar 5 categorias

**Request:**
```
GET http://localhost:3333/api/categorias
```

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Body: Array com exatamente 5 categorias
- ✅ Cada categoria tem: id, nome, descricao, _count.produtos

**Verificar:**
- Eletrônicos
- Alimentos
- Limpeza
- Ferramentas
- Papelaria

---

### ✅ Teste 3: POST /api/produtos - Criar produto

**Request:**
```
POST http://localhost:3333/api/produtos
Content-Type: application/json

{
  "nome": "Produto Teste",
  "descricao": "Descrição do produto teste",
  "quantidade": 10,
  "quantidadeMinima": 5,
  "preco": 99.90,
  "unidade": "un",
  "categoriaId": "{{categoriaId}}",
  "usuarioId": "{{usuarioId}}"
}
```

**Resultado Esperado:**
- ✅ Status: `201 Created`
- ✅ Body: Produto criado com id gerado
- ✅ Inclui categoria e usuario relacionados

**Importante:** Copie o `id` do produto criado para usar nos próximos testes!

---

### ✅ Teste 4: GET /api/produtos/:id - Buscar por ID

**Request:**
```
GET http://localhost:3333/api/produtos/{id-do-produto-criado}
```

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Body: Produto completo
- ✅ Inclui objeto `categoria` completo
- ✅ Inclui objeto `usuario` (sem senha)

---

### ✅ Teste 5: PUT /api/produtos/:id - Atualizar

**Request:**
```
PUT http://localhost:3333/api/produtos/{id-do-produto-criado}
Content-Type: application/json

{
  "quantidade": 20,
  "preco": 89.90
}
```

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Body: Produto atualizado
- ✅ `quantidade` = 20
- ✅ `preco` = 89.90
- ✅ Outros campos inalterados

---

### ✅ Teste 6: DELETE /api/produtos/:id - Deletar

**Request:**
```
DELETE http://localhost:3333/api/produtos/{id-do-produto-criado}
```

**Resultado Esperado:**
- ✅ Status: `204 No Content`
- ✅ Body: Vazio (sem conteúdo)

**Verificar:** Tente buscar o produto novamente (deve retornar 404)

---

### ✅ Teste 7: GET /api/produtos/id-errado - 404

**Request:**
```
GET http://localhost:3333/api/produtos/id-invalido-123
```

**Resultado Esperado:**
- ✅ Status: `404 Not Found`
- ✅ Body:
```json
{
  "status": "error",
  "message": "Produto não encontrado"
}
```

---

### ✅ Teste 8: POST sem campos - 400

**Request:**
```
POST http://localhost:3333/api/produtos
Content-Type: application/json

{}
```

**Resultado Esperado:**
- ✅ Status: `400 Bad Request`
- ✅ Body:
```json
{
  "status": "error",
  "message": "Erro de validação",
  "errors": [...]
}
```

**Verificar:** Array de erros com mensagens para cada campo obrigatório

---

## 📊 Resumo dos Testes

| # | Teste | Método | Endpoint | Status | Body |
|---|-------|--------|----------|--------|------|
| 1 | Listar produtos | GET | /api/produtos | 200 | Array |
| 2 | Listar categorias | GET | /api/categorias | 200 | 5 items |
| 3 | Criar produto | POST | /api/produtos | 201 | Produto |
| 4 | Buscar por ID | GET | /api/produtos/:id | 200 | Produto + relações |
| 5 | Atualizar | PUT | /api/produtos/:id | 200 | Atualizado |
| 6 | Deletar | DELETE | /api/produtos/:id | 204 | Vazio |
| 7 | ID inválido | GET | /api/produtos/xxx | 404 | Erro |
| 8 | Sem campos | POST | /api/produtos | 400 | Erro validação |

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to server"
- Verifique se o servidor está rodando (`npm run dev`)
- Confirme a porta 3333 está livre

### Erro: "Categoria não encontrada"
- Verifique se o `categoriaId` está correto
- Execute `npm run prisma:seed` novamente

### Erro: "Usuário não encontrado"
- Verifique se o `usuarioId` está correto
- Execute `npm run prisma:seed` novamente

### Teste 6 retorna 404
- O produto já foi deletado em um teste anterior
- Execute o teste 3 novamente para criar um novo produto

---

## ✅ Todos os Testes Passaram?

Se todos os 8 testes estão verdes (✅), sua API está funcionando perfeitamente! 🎉

Próximo passo: Integrar o frontend mobile com a API.
