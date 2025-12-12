-- Create profiles table
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  full_name text,
  balance numeric default 1000,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create transactions table
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) not null,
  receiver_id uuid references profiles(id) not null,
  amount numeric not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for transactions
alter table transactions enable row level security;

-- Create policies for transactions
create policy "Users can view their own transactions (sent or received)." on transactions
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can insert transactions (sender must be auth user)." on transactions
  for insert with check (auth.uid() = sender_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username, balance)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username', 1000);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();