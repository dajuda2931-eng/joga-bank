-- 1. Tabela de Contatos (cria apenas se não existir)
create table if not exists contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  contact_id uuid references profiles(id) not null,
  nickname text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, contact_id)
);

-- Habilita segurança (RLS)
alter table contacts enable row level security;

-- 2. Políticas de Segurança (remove antigas e cria novas para evitar erros)
drop policy if exists "Users can view their own contacts." on contacts;
create policy "Users can view their own contacts." on contacts for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own contacts." on contacts;
create policy "Users can insert their own contacts." on contacts for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own contacts." on contacts;
create policy "Users can delete their own contacts." on contacts for delete using (auth.uid() = user_id);

-- 3. Função de Transferência (recria do zero)
DROP FUNCTION IF EXISTS transfer_coins;

create or replace function transfer_coins(receiver_id uuid, amount numeric)
returns void
language plpgsql
security definer
as $$
declare
  sender_id uuid;
  sender_balance numeric;
begin
  sender_id := auth.uid();
  
  select balance into sender_balance from profiles where id = sender_id;
  
  if sender_balance < amount then
    raise exception 'Saldo insuficiente';
  end if;

  update profiles set balance = balance - amount where id = sender_id;
  update profiles set balance = balance + amount where id = receiver_id;

  insert into transactions (sender_id, receiver_id, amount, description)
  values (sender_id, receiver_id, amount, 'Transferência via App');
end;
$$;
