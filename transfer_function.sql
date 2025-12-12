-- Function to handle safe money transfer
create or replace function transfer_coins(receiver_id uuid, amount numeric)
returns void
language plpgsql
security definer
as $$
declare
  sender_id uuid;
  sender_balance numeric;
begin
  -- Get sender ID from auth
  sender_id := auth.uid();
  
  -- Check if sender has enough balance
  select balance into sender_balance from profiles where id = sender_id;
  
  if sender_balance < amount then
    raise exception 'Saldo insuficiente';
  end if;

  -- Deduct from sender
  update profiles 
  set balance = balance - amount 
  where id = sender_id;

  -- Add to receiver
  update profiles 
  set balance = balance + amount 
  where id = receiver_id;

  -- Record transaction
  insert into transactions (sender_id, receiver_id, amount, description)
  values (sender_id, receiver_id, amount, 'Transferência via App');
end;
$$;
