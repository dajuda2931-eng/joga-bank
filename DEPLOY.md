# 🚀 Como Fazer Deploy do Joga Bank na Vercel

Siga este guia para colocar seu app online com HTTPS válido e URL personalizada!

## Passo 1: Criar Conta na Vercel

1. Acesse [vercel.com/signup](https://vercel.com/signup)
2. Faça login com GitHub, GitLab ou email
3. É **100% grátis** para projetos pessoais

## Passo 2: Fazer Deploy

Abra o terminal na pasta do projeto e rode:

```bash
vercel
```

### O que vai acontecer:

1. **Login**: Se for a primeira vez, vai pedir para fazer login
   - Vai abrir o navegador automaticamente
   - Confirme o login

2. **Configuração do Projeto**:
   - `Set up and deploy "~/Documents/joga bank"?` → **Y** (Yes)
   - `Which scope?` → Escolha sua conta (aperte Enter)
   - `Link to existing project?` → **N** (No)
   - `What's your project's name?` → **joga-bank** (ou o nome que quiser)
   - `In which directory is your code located?` → **./** (aperte Enter)
   - `Want to override the settings?` → **N** (No)

3. **Deploy Automático**:
   - A Vercel vai fazer build e deploy
   - Em ~1 minuto, seu app estará online! 🎉

## Passo 3: Acessar seu App

Após o deploy, você receberá **3 URLs**:

- **Preview**: `https://joga-bank-xxx.vercel.app` (temporária)
- **Production**: `https://joga-bank.vercel.app` (permanente) ✅

Acesse a URL de **Production** - ela terá:
- ✅ HTTPS válido (sem avisos)
- ✅ Certificado SSL automático
- ✅ Funciona em qualquer dispositivo

## Passo 4: Configurar Variáveis de Ambiente

**IMPORTANTE**: Suas credenciais do Supabase estão no arquivo `.env`, mas a Vercel não tem acesso a ele.

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique no projeto **joga-bank**
3. Vá em **Settings** → **Environment Variables**
4. Adicione:
   - `VITE_SUPABASE_URL` = `https://sikjgmestgvzxyuykxib.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (sua chave)
5. Clique em **Save**
6. Vá em **Deployments** → clique nos 3 pontinhos do último deploy → **Redeploy**

## Passo 5: Domínio Personalizado (Opcional)

Se quiser uma URL tipo `jogabank.com`:

1. Compre um domínio (Registro.br, Namecheap, etc)
2. Na Vercel: **Settings** → **Domains**
3. Adicione seu domínio
4. Configure os DNS conforme instruções da Vercel
5. Pronto! HTTPS automático incluído 🔒

## Comandos Úteis

- **Deploy de produção**: `vercel --prod`
- **Ver logs**: `vercel logs`
- **Remover projeto**: `vercel remove joga-bank`

## Troubleshooting

**Erro de build?**
- Verifique se rodou `npm run build` localmente sem erros

**App em branco?**
- Confira se adicionou as variáveis de ambiente do Supabase

**Precisa atualizar?**
- Basta rodar `vercel --prod` novamente na pasta do projeto
