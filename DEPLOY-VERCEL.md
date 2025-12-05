# 🚀 Guia de Deploy - ConectaIES Frontend no Vercel

## 📋 Pré-requisitos

- Conta no GitHub (para conectar ao Vercel)
- Conta no Vercel (gratuita) - https://vercel.com
- Git instalado
- Projeto Angular funcionando localmente

---

## 📝 Passo a Passo Completo

### **ETAPA 1: Preparar o Projeto**

#### 1.1 Verificar Build Local
Antes de fazer deploy, teste se o build funciona localmente:

```bash
cd ConectaIES-Front\conecta-ies-front
npm install
npm run build
```

Se o build for bem-sucedido, você verá uma pasta `dist/` ou `dist/browser/` criada.

#### 1.2 Criar arquivo de configuração do Vercel

Crie um arquivo `vercel.json` na raiz do projeto Angular (`conecta-ies-front/`):

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/conecta-ies-front/browser",
  "framework": "angular",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Por que isso é necessário?**
- `rewrites`: Garante que todas as rotas do Angular funcionem corretamente (SPA routing)
- `outputDirectory`: Indica onde estão os arquivos buildados
- `framework`: O Vercel otimiza automaticamente para Angular

---

### **ETAPA 2: Preparar Variáveis de Ambiente**

#### 2.1 Verificar arquivos de ambiente

Procure por arquivos como:
- `src/environments/environment.ts` (desenvolvimento)
- `src/environments/environment.prod.ts` (produção)

Se tiver URLs de API hardcoded, você precisará configurar variáveis de ambiente no Vercel.

#### 2.2 Criar arquivo `.env.example` (opcional, mas recomendado)

```env
# API Backend (será configurado quando o backend estiver no Render)
VITE_API_URL=https://seu-backend.onrender.com
VITE_WS_URL=wss://seu-backend.onrender.com
```

---

### **ETAPA 3: Configurar Git e GitHub**

#### 3.1 Inicializar repositório Git (se ainda não tiver)

```bash
cd ConectaIES-Front\conecta-ies-front
git init
```

#### 3.2 Criar `.gitignore` (se não existir)

```gitignore
# Node
node_modules/
npm-debug.log
package-lock.json

# Angular
.angular/
dist/
tmp/
out-tsc/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

#### 3.3 Fazer commit inicial

```bash
git add .
git commit -m "feat: configuração inicial para deploy no Vercel"
```

#### 3.4 Criar repositório no GitHub

1. Acesse https://github.com/new
2. Nome: `ConectaIES-Front` (ou outro de sua preferência)
3. Deixe **público** ou **privado** (Vercel funciona com ambos)
4. **NÃO** inicialize com README, .gitignore ou license
5. Clique em **Create repository**

#### 3.5 Conectar repositório local ao GitHub

```bash
git remote add origin https://github.com/SEU-USUARIO/ConectaIES-Front.git
git branch -M main
git push -u origin main
```

---

### **ETAPA 4: Deploy no Vercel**

#### 4.1 Acessar Vercel

1. Acesse https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New Project"** ou **"Import Project"**

#### 4.2 Importar Repositório

1. Selecione o repositório `ConectaIES-Front`
2. Clique em **Import**

#### 4.3 Configurar o Projeto

**Framework Preset:** Angular (deve detectar automaticamente)

**Root Directory:** 
- Se seu `package.json` está em `conecta-ies-front/`, selecione essa pasta
- Ou deixe em branco se estiver na raiz

**Build and Output Settings:**
- Build Command: `npm run build` (ou deixe automático)
- Output Directory: `dist/conecta-ies-front/browser` (ou `dist/browser`)
- Install Command: `npm install`

**Environment Variables (por enquanto, deixe vazio)**
- Você adicionará depois quando o backend estiver pronto

#### 4.4 Deploy

1. Clique em **Deploy**
2. Aguarde o build (geralmente 2-5 minutos)
3. Se tudo der certo, você verá: ✅ **"Deployment successful"**

---

### **ETAPA 5: Verificar Deploy**

#### 5.1 Acessar URL

O Vercel gera uma URL automática:
```
https://conecta-ies-front-xxxxx.vercel.app
```

#### 5.2 Testar Funcionalidades

✅ Checklist:
- [ ] Página inicial carrega
- [ ] Navegação entre rotas funciona
- [ ] Estilos (CSS/SCSS) aplicados corretamente
- [ ] Imagens e assets carregam
- [ ] VLibras aparece
- [ ] Dark mode funciona
- [ ] Atalhos de acessibilidade funcionam

⚠️ **Funcionalidades que NÃO vão funcionar ainda:**
- Login/Registro (depende do backend)
- WebSocket (depende do backend)
- Chamadas à API (depende do backend)

---

### **ETAPA 6: Configurar Domínio Personalizado (Opcional)**

#### 6.1 No Dashboard do Vercel

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `conectaies.com`)
3. Configure DNS conforme instruções do Vercel

---

### **ETAPA 7: Configurações Adicionais**

#### 7.1 Configurar Variáveis de Ambiente (depois que o backend estiver pronto)

1. No Vercel Dashboard → **Settings** → **Environment Variables**
2. Adicione:
   - `VITE_API_URL`: URL do backend no Render
   - `VITE_WS_URL`: URL WebSocket do backend

3. Refaça o deploy:
```bash
git commit --allow-empty -m "trigger deploy"
git push
```

#### 7.2 Configurar Redirects/Rewrites (se necessário)

No `vercel.json`, você pode adicionar regras como:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

## 🔄 Deploy Contínuo (CI/CD)

A partir de agora, **todo push para a branch `main`** no GitHub vai disparar um novo deploy automaticamente!

### Para fazer updates:

```bash
# Faça suas alterações
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# Deploy automático inicia!
```

### Branches de Preview

Ao criar um Pull Request ou push em outra branch, o Vercel cria um **preview deployment** automático com URL única.

---

## 🐛 Troubleshooting

### Erro: "Build failed"

**Solução:**
1. Verifique os logs no Vercel Dashboard
2. Teste o build localmente: `npm run build`
3. Verifique se o `package.json` está correto
4. Confirme que o `outputDirectory` no `vercel.json` está correto

### Erro: "404 ao navegar entre páginas"

**Solução:**
Adicione ou verifique o `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Assets (imagens, fontes) não carregam

**Solução:**
Verifique o `angular.json` → `assets`:
```json
"assets": [
  { "glob": "**/*", "input": "src/assets", "output": "assets" }
]
```

### Erro de memória durante build

**Solução:**
Adicione no `package.json`:
```json
"scripts": {
  "build": "node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build"
}
```

---

## 📊 Monitoramento

### Analytics do Vercel

1. Vá em **Analytics** no dashboard
2. Monitore:
   - Pageviews
   - Performance
   - Erros

### Logs

- **Real-time Logs**: Settings → Functions → View Logs
- **Build Logs**: Cada deployment tem logs completos

---

## 🔐 Segurança

### Recomendações:

1. **Environment Variables**: Nunca commite chaves secretas no Git
2. **CORS**: Configure no backend para aceitar requisições do domínio Vercel
3. **HTTPS**: Vercel já fornece SSL/TLS automático

---

## 📱 Próximos Passos (Depois do Backend)

1. ✅ Deploy do Backend no Render (PostgreSQL)
2. ✅ Configurar variáveis de ambiente no Vercel apontando para o backend
3. ✅ Testar integração completa
4. ✅ Configurar CORS no backend
5. ✅ Testar autenticação, WebSocket, uploads

---

## 📞 Recursos Úteis

- **Documentação Vercel**: https://vercel.com/docs
- **Angular no Vercel**: https://vercel.com/guides/deploying-angular-with-vercel
- **Dashboard Vercel**: https://vercel.com/dashboard
- **Status do Vercel**: https://www.vercel-status.com

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Build local funciona
- [ ] Repositório no GitHub atualizado
- [ ] `vercel.json` configurado
- [ ] Deploy no Vercel bem-sucedido
- [ ] URL de produção acessível
- [ ] Todas as rotas funcionam (SPA routing)
- [ ] Assets carregam corretamente
- [ ] Acessibilidade testada (VLibras, dark mode, keyboard)
- [ ] Pronto para conectar com backend

---

**🎉 Seu frontend estará no ar e pronto para conectar com o backend quando ele estiver pronto!**
