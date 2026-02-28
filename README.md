# AUTVYA – Plataforma de Comunicação para Crianças Neurodiversas

Plataforma web gamificada para crianças neurodiversas (4–10 anos) com interface infantil interativa, dashboard analítico para pais/educadores e IA especializada integrada via Claude API.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + React Router 6 + Recharts |
| Backend | Node.js + Express 4 + Prisma ORM |
| Banco | Supabase (PostgreSQL) |
| IA | Anthropic Claude API (claude-sonnet-4-6) |
| Auth | JWT + bcrypt |
| Deploy | Vercel (frontend) + Railway (backend) + Supabase (DB) |

---

## Instalação e Execução

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com) (banco PostgreSQL)
- Chave da [Anthropic API](https://console.anthropic.com)

### 1. Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Gerar o cliente Prisma e aplicar o schema no banco
npx prisma generate
npx prisma db push

# Iniciar em modo desenvolvimento
npm run dev
```

O backend estará disponível em `http://localhost:3001`.

### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## Variáveis de Ambiente (backend/.env)

```env
DATABASE_URL=postgresql://user:password@host:5432/autvya?schema=public
JWT_SECRET=sua-chave-secreta-muito-longa-e-segura
ANTHROPIC_API_KEY=sk-ant-...
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

---

## Estrutura do Projeto

```
D:\Projeto AUTVYA\
├── frontend/          # React 18 + Vite
│   ├── src/
│   │   ├── pages/     # Login, Register, Dashboard, ChildInterface, ...
│   │   ├── components/ # Pictogram, PictogramGrid, UsageChart, ...
│   │   ├── context/   # AuthContext (JWT global state)
│   │   ├── hooks/     # useSound (TTS PT-BR)
│   │   └── services/  # api.js (Axios)
│   └── public/        # manifest.json, sw.js (PWA)
│
└── backend/           # Node.js + Express
    ├── prisma/        # schema.prisma
    └── src/
        ├── routes/    # auth, children, interactions, ai, reports
        ├── controllers/
        ├── services/  # ai.service.js, metrics.service.js
        ├── middleware/ # auth.js (JWT)
        └── config/    # database.js, anthropic.js
```

---

## API Endpoints

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/auth/register` | Registro com consentimento LGPD |
| POST | `/api/v1/auth/login` | Login com JWT |
| GET | `/api/v1/auth/me` | Dados do usuário autenticado |

### Crianças
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/children` | Listar perfis |
| POST | `/api/v1/children` | Criar perfil |
| GET | `/api/v1/children/:id` | Buscar perfil |
| PUT | `/api/v1/children/:id` | Atualizar perfil/fase |
| DELETE | `/api/v1/children/:id` | Excluir perfil |

### Interações
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/interactions` | Registrar interação |
| POST | `/api/v1/interactions/lote` | Registrar lote (sync offline) |
| GET | `/api/v1/interactions/:criancaId/metrics` | Métricas agregadas |

### IA
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/ai/analise` | Gerar análise com Claude |

### Relatórios
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/reports/resumo` | Resumo de todas as crianças |
| GET | `/api/v1/reports/:criancaId` | Relatório detalhado |

---

## Fases de Comunicação

| Fase | Nome | Descrição |
|------|------|-----------|
| 1 | Conexão | Grid 2×3 com 6 pictogramas básicos |
| 2 | Escolha | 2–4 opções contextuais |
| 3 | Comunicação | Combinação de pictogramas para formar frases |

---

## Pictogramas

| ID | Label | Emoji | Cor fundo |
|----|-------|-------|-----------|
| agua | Água | 💧 | #EBF4FF |
| comer | Comer | 🍽️ | #F0FDF4 |
| brincar | Brincar | 🎮 | #FFFBEB |
| mais | Mais | ➕ | #EBF4FF |
| dormir | Dormir | 😴 | #F0FDF4 |
| nao | Não | 🚫 | #FFF1F2 |

---

## Design System

| Token | Valor | Uso |
|-------|-------|-----|
| Primary | `#4F7FFF` | Botões, headers, links |
| Secondary | `#A6E3A1` | Feedback positivo |
| Neutral | `#F5F7FA` | Background |
| Feedback | `#FFD166` | Gamificação, conquistas |
| Border-radius | `1rem` | Todos os elementos |

---

## Teste do Fluxo Completo

1. Acesse `http://localhost:5173/registro`
2. Crie uma conta (marque o consentimento LGPD)
3. No dashboard, clique em **"+ Novo perfil"**
4. Preencha nome, idade e fase → salvar
5. Clique **"Iniciar sessão"** → interface infantil abre
6. Toque nos pictogramas → ouça a voz + animação
7. Volte ao dashboard → veja as métricas
8. Acesse **Relatórios** → clique **"✨ Gerar análise"**

### Testar endpoint IA diretamente

```bash
curl -X POST http://localhost:3001/api/v1/ai/analise \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"criancaId": "ID_DA_CRIANCA", "dias": 30}'
```

---

## Deploy

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy via Vercel CLI ou conecte o repositório GitHub
vercel --prod
```

### Backend (Railway)
1. Conecte o repositório no [Railway](https://railway.app)
2. Defina as variáveis de ambiente no painel
3. O Railway detecta automaticamente Node.js e faz o deploy

### Banco (Supabase)
1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie a `DATABASE_URL` do painel (Settings → Database)
3. Execute `npx prisma db push` para criar as tabelas

---

## Segurança

- Senhas com bcrypt (rounds: 12)
- JWT com expiração de 7 dias
- Helmet.js para headers HTTP de segurança
- CORS restrito ao domínio frontend
- Validação de entrada com express-validator
- Isolamento por userId (criança só acessível pelo responsável)
- Consentimento LGPD coletado no registro

---

## Aviso Importante

> O AUTVYA é uma ferramenta de suporte à comunicação e **não substitui** avaliação ou acompanhamento por profissionais de saúde (fonoaudiólogos, terapeutas ocupacionais, psicólogos, neurologistas). As análises geradas por IA são baseadas em padrões de uso e não constituem diagnóstico clínico.
