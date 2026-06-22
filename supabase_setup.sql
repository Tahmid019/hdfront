-- SQL Setup Script for HemoSync Pro RBAC in Supabase
-- Run this in the SQL Editor of your Supabase Project.

-- 1. Enable extensions if not already enabled
create extension if not exists "uuid-ossp";

-- 2. Create the Profiles Table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text not null check (role in ('doctor', 'technician', 'user')),
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row-Level Security on Profiles
alter table public.profiles enable row level security;

-- 3. Define RLS Policies for Profiles
-- A. Select Policy:
-- - A user can view their own profile.
-- - Doctors can view all profiles.
-- - Technicians can view user and technician profiles.
create policy "Allow profile reads based on role and ownership"
  on public.profiles for select
  using (
    auth.uid() = id
    or (auth.jwt()->'user_metadata'->>'role') = 'doctor'
    or (
      (auth.jwt()->'user_metadata'->>'role') = 'technician'
      and role in ('user', 'technician')
    )
  );

-- B. Insert Policy: Allowed for the system trigger or when matching auth.uid()
create policy "Allow profile insertion by authenticated owner"
  on public.profiles for insert
  with check (auth.uid() = id);

-- C. Update Policy: Owner can update their own profile details
create policy "Allow profile updates by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);


-- 4. Create trigger to automatically insert profile when auth.users is created
-- It uses the role and full_name passed in the signup raw user metadata (options.data in JS)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'user'),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 5. Create BEFORE UPDATE trigger to prevent role hijacking/changing from client
create or replace function public.preserve_user_role()
returns trigger as $$
begin
  if new.role <> old.role then
    new.role := old.role; -- Silently discard role modification unless using service role bypass
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_profile_role_update on public.profiles;
create trigger on_profile_role_update
  before update on public.profiles
  for each row execute procedure public.preserve_user_role();


-- 6. Create Dialysis Sessions Table
create table if not exists public.dialysis_sessions (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references public.profiles(id) on delete cascade not null,
  doctor_id uuid references public.profiles(id) on delete set null,
  technician_id uuid references public.profiles(id) on delete set null,
  status text check (status in ('scheduled', 'active', 'completed')) default 'scheduled' not null,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  notes text,
  metrics jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Dialysis Sessions
alter table public.dialysis_sessions enable row level security;

-- Define RLS Policies for Dialysis Sessions
-- A. Doctors have complete control
create policy "Doctors full access on sessions"
  on public.dialysis_sessions for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'doctor'
    )
  );

-- B. Technicians can read all sessions, and update metrics and notes for active/scheduled ones
create policy "Technicians read sessions"
  on public.dialysis_sessions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'technician'
    )
  );

create policy "Technicians update sessions"
  on public.dialysis_sessions for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'technician'
    )
  );

-- C. Patients (Users) can only read their own sessions
create policy "Patients view own sessions"
  on public.dialysis_sessions for select
  using (patient_id = auth.uid());


-- 7. Create Machine Status Table (Dialysis hardware)
create table if not exists public.machine_status (
  id uuid default gen_random_uuid() primary key,
  machine_serial text unique not null,
  status text check (status in ('operational', 'maintenance', 'offline')) default 'operational' not null,
  temperature numeric default 37.0,
  conductivity numeric default 13.8,
  pressure numeric default -180.0,
  last_maintenance timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Machine Status
alter table public.machine_status enable row level security;

-- Define RLS Policies for Machine Status
-- A. Clinical staff (Doctors and Technicians) can read machine statuses
create policy "Staff view machines"
  on public.machine_status for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('doctor', 'technician')
    )
  );

-- B. Only Technicians can insert or update machine parameters and status
create policy "Technicians manage machines"
  on public.machine_status for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'technician'
    )
  );
