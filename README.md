# Carteira Digital — Frontend (Vue 3 + TypeScript)

SPA que consome a API da Carteira Digital (Laravel). Autenticação por token (Bearer),
dashboard com saldo e resumo do mês, depósito, saque com validação de saldo no frontend,
e histórico com filtros e paginação.

## Links

| Recurso | URL |
|---|---|
| **Deploy (Aplicação)** | https://teck-solucoes-frontend.vercel.app/ |
| **API (Backend)** | https://tecksolucoesbackend-production.up.railway.app/api/ |
| **Repositório (Frontend)** | https://github.com/Andraad3/teck_solucoes_frontend |
| **Repositório (Backend)** | https://github.com/Andraad3/teck_solucoes_backend |

### Credenciais de teste (usuário seed)

```
E-mail: demo@example.com
Senha:  password
```

Também é possível criar uma conta nova pela tela de cadastro.

## Stack

- **Vue 3** (Composition API, `<script setup lang="ts">`)
- **TypeScript** · **Vite**
- **Pinia** (estado) · **Vue Router** (rotas + guard)
- **Axios** (HTTP com interceptors)
- **Tailwind CSS** (v4)

## Pré-requisitos

- **Node.js** >= 20 (desenvolvido em 22) · **npm** >= 10
- A **API (backend)** rodando — em produção já aponta para o deploy; para uso local,
  suba o backend em `http://localhost:8000`:

```bash
# na raiz do projeto (backend)
docker compose up -d
php artisan migrate --seed   # cria o usuário demo
php artisan serve            # http://localhost:8000
```

## Setup

```bash
# 1. Clonar e instalar dependências
git clone https://github.com/Andraad3/teck_solucoes_frontend.git
cd teck_solucoes_frontend
npm install

# 2. Ambiente (.env) — define a URL da API consumida
cp .env.example .env          # VITE_API_BASE_URL=http://localhost:8000/api

# 3. Servir (modo desenvolvimento)
npm run dev                   # http://localhost:5173
```

### Configuração do `.env`

Uma única variável controla qual API o frontend consome:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api
```

Para apontar ao backend em produção, use
`https://tecksolucoesbackend-production.up.railway.app/api`.

Outros scripts:

```bash
npm run build     # type-check (vue-tsc) + build de produção
npm run preview   # serve o build de produção
```

## Estrutura

```
src/
  services/
    http.ts        # axios + interceptors (injeta Bearer; trata 401; normaliza erros)
    auth.ts        # register, login, logout
    wallet.ts      # wallet, deposit, withdraw, dashboard, transactions
  stores/
    auth.ts        # token+user (localStorage), isAuthenticated
    wallet.ts      # balance, resumo do mês, transações, paginação
  router/index.ts  # rotas + navigation guard (requiresAuth / guestOnly)
  composables/
    useMoney.ts    # formatBRL (Intl pt-BR) e parse de input
    useToast.ts    # fila global de toasts
  components/       # NavBar, AppLayout, ToastContainer, BalanceCard,
                    # SummaryCards, AmountField, TransactionTable, Pagination
  views/            # Login, Register, Dashboard, Deposit, Withdraw, Transactions
```

## Funcionalidades e decisões

- **Autenticação por token:** o token é salvo em `localStorage` e injetado em toda
  requisição pelo interceptor do Axios. Em `401`, a sessão é limpa e o usuário é
  redirecionado ao login.
- **Rotas protegidas:** o guard do Vue Router bloqueia rotas privadas sem token e
  impede acesso a login/registro quando já autenticado.
- **Feedback visual:**
  - **Toasts** de sucesso/erro para login, depósito, saque e falhas.
  - **Erros de validação por campo** exibidos abaixo dos inputs, vindos do `errors`
    (HTTP 422) da API, além de validação client-side (obrigatório, ≥ R$ 0,01, ≤ 2 casas).
- **Saque — saldo insuficiente no frontend:** o botão é desabilitado e a mensagem
  "Saldo insuficiente" aparece quando o valor excede o saldo, comparando em **centavos**
  (`balance_cents`) para evitar imprecisão de ponto flutuante. O `422` do servidor
  continua sendo tratado como fonte de verdade.
- **Valores monetários:** a API troca dados em reais; a UI formata com
  `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.

## CORS

A API usa token Bearer (sem cookies) e o default do Laravel 12 já libera `api/*` para
qualquer origem — não é necessário configurar nada. Se restringir origens no backend,
inclua `http://localhost:5173`.
