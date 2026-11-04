create extension if not exists "pgcrypto";

-- ============ PROFILES ============
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  role text not null check (role in ('admin','specialist')),
  specialty text,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Helper (evita recursión en RLS)
create or replace function public.current_user_role()
returns text language sql security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "own profile read"    on public.profiles for select using (auth.uid() = id);
create policy "admin read profiles" on public.profiles for select using (public.current_user_role() = 'admin');
create policy "admin update profiles" on public.profiles for update using (public.current_user_role() = 'admin');

-- Trigger: crea profile al crear usuario en auth.users
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role, specialty, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'specialist'),
    new.raw_user_meta_data->>'specialty',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ APPOINTMENTS ============
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  weight numeric(5,2) not null,
  height numeric(5,2) not null,
  phone text not null,
  specialty text not null,
  appointment_date date not null,
  appointment_time time not null,
  notes text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','completed','cancelled')),
  assigned_specialist_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.appointments enable row level security;

create policy "anyone can request appointment"
  on public.appointments for insert with check (true);

create policy "specialist reads own specialty"
  on public.appointments for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role='specialist' and p.specialty = appointments.specialty
  ));

create policy "specialist updates own specialty"
  on public.appointments for update
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role='specialist' and p.specialty = appointments.specialty
  ));

create policy "admin read all appointments"
  on public.appointments for select using (public.current_user_role() = 'admin');
create policy "admin update all appointments"
  on public.appointments for update using (public.current_user_role() = 'admin');

-- ============ MEDICATIONS ============
create table public.medications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  stock integer not null default 0,
  unit text,
  created_at timestamptz not null default now()
);
alter table public.medications enable row level security;
create policy "auth read medications"
  on public.medications for select using (auth.role() = 'authenticated');
create policy "admin manage medications"
  on public.medications for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');