# Configuração do Supabase - Remover Verificação de Email

## 📋 Instruções

Para permitir que os usuários façam login **imediatamente** após o cadastro, sem precisar verificar o email, siga estes passos no **Supabase Dashboard**:

---

## 🔧 Passo a Passo

### 1. Acesse o Dashboard do Supabase
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto **Joga Bank**

### 2. Navegue até Authentication Settings
- No menu lateral, clique em **Authentication**
- Clique em **Providers** ou **Settings**

### 3. Desabilite a Confirmação de Email
- Procure por **"Email Confirmations"** ou **"Confirm email"**
- **Desmarque** a opção: **"Enable email confirmations"**
- Ou configure para **"Disable email confirmation"**

### 4. Salve as Alterações
- Clique em **Save** no final da página
- As mudanças são aplicadas imediatamente

---

## ✅ Resultado

Após essa configuração:
- ✅ Usuários podem fazer login **imediatamente** após cadastro
- ✅ Não precisam verificar email
- ✅ Experiência mais fluida e rápida
- ✅ Ideal para desenvolvimento e testes

---

## ⚠️ Importante para Produção

> **ATENÇÃO**: Em produção, considere manter a verificação de email ativada para:
> - Prevenir cadastros com emails falsos
> - Garantir que o usuário tem acesso ao email informado
> - Melhorar a segurança da aplicação
> - Permitir recuperação de senha

Para desenvolvimento e testes, é seguro desabilitar.

---

## 🔄 Alternativa: Auto-confirm via SQL

Se preferir, você pode auto-confirmar emails via SQL trigger. Adicione no Supabase SQL Editor:

\`\`\`sql
-- Trigger para auto-confirmar emails
CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_email();
\`\`\`

---

## 📱 Código já Atualizado

O código do app já foi atualizado em [Login.jsx](file:///c:/Users/dajud/Documents/joga%20bank/src/pages/Login.jsx):
- ✅ Removido alerta de "Verifique seu email"
- ✅ Auto-login após cadastro
- ✅ Navegação direta para o dashboard

Basta configurar o Supabase e está pronto! 🚀
