-- Create contacts table
create table contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  contact_id uuid references profiles(id) not null,
  nickname text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, contact_id)
);

-- Enable Row Level Security (RLS)
alter table contacts enable row level security;

-- Create policies for contacts
create policy "Users can view their own contacts." on contacts
  for select using (auth.uid() = user_id);

create policy "Users can insert their own contacts." on contacts
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own contacts." on contacts
  for delete using (auth.uid() = user_id);
