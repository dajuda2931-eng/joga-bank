# Como Executar Scripts SQL no Supabase

Para que o **Joga Bank** funcione corretamente (especialmente as transferências), você precisa criar as tabelas e funções no banco de dados.

## Passo 1: Copiar o Código SQL
Primeiro, copie o código abaixo. Este é o conteúdo do arquivo `transfer_function.sql` que já está no seu projeto, mas corrigido e completo.

```sql
-- Função para transferir moedas com segurança
create or replace function transfer_coins(receiver_id uuid, amount numeric)
returns void
language plpgsql
security definer
as $$
declare
  sender_id uuid;
  sender_balance numeric;
begin
  -- Pega o ID de quem está enviando (usuário logado)
  sender_id := auth.uid();
  
  -- Verifica se tem saldo suficiente
  select balance into sender_balance from profiles where id = sender_id;
  
  if sender_balance < amount then
    raise exception 'Saldo insuficiente';
  end if;

  -- Debita do remetente
  update profiles 
  set balance = balance - amount 
  where id = sender_id;

  -- Credita no destinatário
  update profiles 
  set balance = balance + amount 
  where id = receiver_id;

  -- Registra a transação
  insert into transactions (sender_id, receiver_id, amount, description)
  values (sender_id, receiver_id, amount, 'Transferência via App');
end;
$$;
```

## Passo 2: Acessar o Editor SQL do Supabase
1.  Acesse o painel do seu projeto no [Supabase](https://supabase.com/dashboard).
2.  No menu lateral esquerdo, clique no ícone **SQL Editor** (parece um terminal `>_`).

## Passo 3: Criar e Rodar a Query
1.  Clique no botão verde **"New query"** (ou em uma query em branco).
2.  Cole o código que você copiou no Passo 1.
3.  Clique no botão **"Run"** (ou pressione `Ctrl + Enter`).
4.  Você deve ver uma mensagem de sucesso como `Success. No rows returned`.

## Passo 4: Verificar (Opcional)
Se você ainda não rodou o script de criação das tabelas (`supabase_schema.sql`), faça o mesmo processo com o conteúdo dele também!

Pronto! Agora seu app pode realizar transferências. 🚀
