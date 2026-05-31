#!/bin/bash

# Script para testar a API ProEstoque
# Execute: chmod +x test-api.sh && ./test-api.sh

BASE_URL="http://localhost:3333/api"

echo "🧪 Testando API ProEstoque"
echo "=========================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Teste 1: GET /api/produtos
echo "1️⃣  GET /api/produtos"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/produtos)
status=$(echo "$response" | tail -n1)
if [ "$status" = "200" ]; then
    echo -e "${GREEN}✅ Status 200 OK${NC}"
else
    echo -e "${RED}❌ Status $status (esperado 200)${NC}"
fi
echo ""

# Teste 2: GET /api/categorias
echo "2️⃣  GET /api/categorias"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/categorias)
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)
count=$(echo "$body" | grep -o '"id"' | wc -l)
if [ "$status" = "200" ]; then
    echo -e "${GREEN}✅ Status 200 OK${NC}"
    if [ "$count" = "5" ]; then
        echo -e "${GREEN}✅ 5 categorias encontradas${NC}"
    else
        echo -e "${YELLOW}⚠️  $count categorias (esperado 5)${NC}"
    fi
else
    echo -e "${RED}❌ Status $status (esperado 200)${NC}"
fi
echo ""

# Teste 7: GET /api/produtos/id-errado (404)
echo "7️⃣  GET /api/produtos/id-errado"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/produtos/id-invalido-123)
status=$(echo "$response" | tail -n1)
if [ "$status" = "404" ]; then
    echo -e "${GREEN}✅ Status 404 Not Found${NC}"
else
    echo -e "${RED}❌ Status $status (esperado 404)${NC}"
fi
echo ""

# Teste 8: POST sem campos (400)
echo "8️⃣  POST /api/produtos (sem campos)"
response=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/produtos \
    -H "Content-Type: application/json" \
    -d '{}')
status=$(echo "$response" | tail -n1)
if [ "$status" = "400" ]; then
    echo -e "${GREEN}✅ Status 400 Bad Request${NC}"
else
    echo -e "${RED}❌ Status $status (esperado 400)${NC}"
fi
echo ""

echo "=========================="
echo "✅ Testes básicos concluídos!"
echo ""
echo "💡 Para testes completos (criar, atualizar, deletar):"
echo "   Use o Thunder Client no VS Code"
echo "   Veja: TESTING_GUIDE.md"
