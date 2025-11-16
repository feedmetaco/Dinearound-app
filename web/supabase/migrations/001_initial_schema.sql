-- DineAround Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users (extends Supabase Auth)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'premium')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Restaurants (cached Google Places data)
create table if not exists public.restaurants (
  id uuid primary key default uuid_generate_v4(),
  google_place_id text unique,
  name text not null,
  address text,
  lat numeric(10, 8),
  lng numeric(11, 8),
  cuisine_type text,
  price_level int check (price_level between 1 and 4),
  rating numeric(3, 2),
  photo_url text,
  cached_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Visits (user logs)
create table if not exists public.visits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  restaurant_id uuid references public.restaurants(id),
  visit_date date not null,
  rating_overall int check (rating_overall between 1 and 5),
  rating_food int check (rating_food between 1 and 5),
  rating_service int check (rating_service between 1 and 5),
  rating_ambiance int check (rating_ambiance between 1 and 5),
  notes text,
  photos text[], -- array of R2 URLs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Wishlist
create table if not exists public.wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  restaurant_id uuid references public.restaurants(id) not null,
  tags text[],
  notes text,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, restaurant_id)
);

-- OCR Jobs (for future menu scanning feature)
create table if not exists public.ocr_jobs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  visit_id uuid references public.visits(id) on delete cascade,
  image_url text not null,
  extracted_text text,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row-Level Security Policies
-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.visits enable row level security;
alter table public.wishlists enable row level security;
alter table public.ocr_jobs enable row level security;

-- Users can read their own profile
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Visits policies
create policy "Users can view own visits"
  on public.visits for select
  using (auth.uid() = user_id);

create policy "Users can insert own visits"
  on public.visits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own visits"
  on public.visits for update
  using (auth.uid() = user_id);

create policy "Users can delete own visits"
  on public.visits for delete
  using (auth.uid() = user_id);

-- Wishlist policies
create policy "Users can view own wishlist"
  on public.wishlists for select
  using (auth.uid() = user_id);

create policy "Users can insert own wishlist"
  on public.wishlists for insert
  with check (auth.uid() = user_id);

create policy "Users can update own wishlist"
  on public.wishlists for update
  using (auth.uid() = user_id);

create policy "Users can delete own wishlist"
  on public.wishlists for delete
  using (auth.uid() = user_id);

-- OCR Jobs policies
create policy "Users can view own OCR jobs"
  on public.ocr_jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own OCR jobs"
  on public.ocr_jobs for insert
  with check (auth.uid() = user_id);

-- Restaurants are public (anyone can read, but only system can write)
create policy "Anyone can view restaurants"
  on public.restaurants for select
  using (true);

-- Indexes for performance
create index if not exists visits_user_id_idx on public.visits(user_id);
create index if not exists visits_visit_date_idx on public.visits(visit_date desc);
create index if not exists restaurants_google_place_id_idx on public.restaurants(google_place_id);
create index if not exists wishlists_user_id_idx on public.wishlists(user_id);
create index if not exists restaurants_location_idx on public.restaurants using gist (point(lng, lat));

-- Function to automatically create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user profile when auth user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

