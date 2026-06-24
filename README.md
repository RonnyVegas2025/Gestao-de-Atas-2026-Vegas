# GestãoAtas — Sistema de Controle de Governança

Sistema completo de gestão de atas e documentos corporativos, construído com React, TypeScript, Tailwind CSS e Vite.

---

## 🚀 Deploy no Vercel (via GitHub)

### Passo 1 — Criar repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"**
3. Nome: `gestaoatas`
4. Marque como **Private** (recomendado)
5. Clique em **"Create repository"**
6. Copie o link do repositório (ex: `https://github.com/seu-usuario/gestaoatas.git`)

### Passo 2 — Subir os arquivos para o GitHub

Como você não pode instalar nada no PC, use a **interface web do GitHub**:

1. No repositório criado, clique em **"uploading an existing file"**
2. Arraste **todos os arquivos e pastas** deste projeto
3. Clique em **"Commit changes"**

> **Atenção:** A pasta `node_modules` **NÃO** deve ser enviada (está no .gitignore).

### Passo 3 — Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório `gestaoatas`
4. Vercel vai detectar automaticamente que é **Vite**
5. Configurações:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Clique em **"Deploy"**
7. Aguarde ~2 minutos e seu sistema estará online!

---

## 🔑 Credenciais de Acesso

| Usuário | E-mail | Senha | Perfil |
|---------|--------|-------|--------|
| Administrador | admin@financeata.com | admin123 | Administrador |
| Maria Souza | maria.souza@corporativo.com | admin123 | Editor |
| João Lima | joao.lima@licitacoes.gov | admin123 | Editor |
| Gabriela Costa | gabriela.costa@auxiliar.com | admin123 | Leitor |

---

## 📁 Estrutura do Projeto

```
gestaoatas/
├── public/
│   └── favicon.svg
├── src/
│   ├── providers/
│   │   └── DataProvider.tsx     # Gerenciamento de estado global + localStorage
│   ├── layouts/
│   │   └── MainLayout.tsx       # Layout com sidebar e topbar
│   ├── components/
│   │   ├── ProtectedRoute.tsx   # Proteção de rotas autenticadas
│   │   └── Topbar.tsx           # Barra superior com notificações
│   ├── modules/
│   │   ├── login/               # Página de login
│   │   ├── dashboard/           # Painel principal com gráficos
│   │   ├── atas/                # CRUD completo de atas
│   │   ├── categorias/          # Gerenciamento de categorias
│   │   ├── uploads/             # Controle de uploads
│   │   ├── lixeira/             # Lixeira com restauração
│   │   ├── usuarios/            # Gestão de usuários
│   │   ├── permissoes/          # Matriz de permissões
│   │   ├── relatorios/          # Relatórios estatísticos
│   │   └── perfil/              # Perfil do usuário
│   ├── types.ts                 # Tipos TypeScript
│   ├── App.tsx                  # Roteamento principal
│   ├── main.tsx                 # Entry point
│   └── index.css                # Estilos globais + Tailwind
├── index.html
├── vite.config.ts
├── vercel.json                  # Configuração para SPA routing
├── tsconfig.json
└── package.json
```

---

## 💡 Observações Importantes

### Persistência de dados
Os dados são salvos no **localStorage** do navegador. Isso significa:
- ✅ Dados persistem ao recarregar a página
- ✅ Funciona 100% sem backend
- ⚠️ Dados são por navegador/dispositivo (cada pessoa vê seus próprios dados)
- ⚠️ Limpar o cache/cookies apaga os dados

### Próximos passos (após a apresentação)
Para uso em produção real com múltiplos usuários compartilhando dados:
1. Integrar **Supabase** como banco de dados (PostgreSQL)
2. Usar **Supabase Auth** para autenticação real com JWT
3. Migrar o `DataProvider` para usar as APIs do Supabase

---

## 🛠️ Rodar Localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos gerados ficam na pasta `dist/` — prontos para deploy.
