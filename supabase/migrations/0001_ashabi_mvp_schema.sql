-- Project Ashabi MVP — Initial Relational Schema & Row-Level Security (RLS)
-- Aligns with PRD Sections 6, 13, 14 and Content API Guide Section 6.

create extension if not exists "pgcrypto";

-- 1. User Profiles & Roles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  username text unique,
  bio text default '',
  role text not null default 'reader'
    check (role in ('reader', 'creator', 'editor', 'rights_manager', 'admin', 'super_admin')),
  favorite_genres text[] not null default '{}',
  release_notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Public Creator Profiles (Private contact/agreements kept separate per CRE-03)
create table if not exists public.creator_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  username text not null unique,
  display_name text not null,
  role_label text not null default 'Creator',
  location text default '',
  avatar_image text default '',
  banner_image text default '',
  bio text not null default '',
  specialties text[] not null default '{}',
  public_label text not null default 'Editorial Showcase'
    check (public_label in ('Featured Creator', 'Creator Partner (Sample)', 'Editorial Showcase')),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. Works / Stories (Content API Guide 6.1 + PRD CMS-03/04)
create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text not null,
  synopsis text not null,
  content_type text not null
    check (content_type in ('Comic', 'Graphic novel', 'Illustrated story', 'Serialized fiction')),
  content_mode text not null
    check (content_mode in ('comic', 'illustrated', 'prose')),
  source_type text not null default 'ashabi'
    check (source_type in ('ashabi', 'public_domain', 'external_metadata')),
  source_name text not null default 'Ashabi Curated Launch Collection',
  source_url text,
  external_id text,
  language text not null default 'en',
  genres text[] not null default '{}',
  tags text[] not null default '{}',
  age_rating text not null default 'All Ages',
  release_status text not null default 'Ongoing',
  release_schedule text not null default '',
  cover_image text not null,
  banner_image text,
  creator_username text not null references public.creator_profiles(username),
  creator_display_name text not null,
  creator_role text not null default 'Creator',
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'review', 'approved', 'scheduled', 'published', 'restricted', 'archived')),
  rights_status text not null default 'under_review'
    check (rights_status in ('demo-only', 'verified_for_web', 'under_review', 'external_do_not_host', 'restricted')),
  attribution_text text not null,
  featured_rank int,
  first_published_at timestamptz,
  updated_at timestamptz not null default now()
);

-- 4. Rights Records (PRD 6.6 RIGHTS-01..06 — Private staff table)
create table if not exists public.rights_records (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  owner_or_rightsholder text not null,
  permission_type text not null,
  permitted_use text not null,
  territory text not null default 'Worldwide',
  language text not null default 'en',
  format text not null,
  start_date date,
  end_date date,
  agreement_storage_path text,
  verification_status text not null default 'under_review'
    check (verification_status in ('draft', 'under_review', 'verified_for_web', 'restricted', 'expired')),
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  restrictions text,
  takedown_contact text,
  created_at timestamptz not null default now()
);

-- 5. Episodes / Chapters (Content API Guide 6.2)
create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  slug text not null,
  sequence_number int not null,
  title text not null,
  synopsis text not null default '',
  mode text not null check (mode in ('comic', 'illustrated', 'prose')),
  asset_type text not null default 'hosted_pages'
    check (asset_type in ('hosted_pages', 'external_link', 'hosted_text', 'embed')),
  payload jsonb not null default '{}'::jsonb,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'review', 'approved', 'scheduled', 'published', 'restricted', 'archived')),
  rights_cleared boolean not null default false,
  estimated_read_minutes int not null default 5,
  published_at timestamptz,
  unique (work_id, slug),
  unique (work_id, sequence_number)
);

-- 6. Reader Library & Progress (ACC-03, ACC-04, READ-04)
create table if not exists public.story_follows (
  user_id uuid not null references public.profiles(id) on delete cascade,
  work_id uuid not null references public.works(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, work_id)
);

create table if not exists public.reading_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  work_id uuid not null references public.works(id) on delete cascade,
  episode_id uuid not null references public.episodes(id) on delete cascade,
  percent int not null default 0 check (percent between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, work_id)
);

-- 7. Content Reports & Audit Logs (READ-05, CMS-07)
create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  work_slug text not null,
  episode_slug text,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'reviewed', 'resolved')),
  created_at timestamptz not null default now()
);

-- Row-Level Security
alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.works enable row level security;
alter table public.rights_records enable row level security;
alter table public.episodes enable row level security;
alter table public.story_follows enable row level security;
alter table public.reading_progress enable row level security;
alter table public.content_reports enable row level security;

-- Public catalog policies: only published + rights-cleared works and episodes are readable
create policy "Public can view approved creator profiles"
  on public.creator_profiles for select
  using (approved = true);

create policy "Public can view published and rights-cleared works"
  on public.works for select
  using (
    publication_status = 'published'
    and rights_status in ('verified_for_web', 'demo-only')
  );

create policy "Public can view published and rights-cleared episodes"
  on public.episodes for select
  using (
    publication_status = 'published'
    and rights_cleared = true
  );

-- Reader self-service policies
create policy "Users can view and update own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users manage own follows"
  on public.story_follows for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own reading progress"
  on public.reading_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can submit a content report"
  on public.content_reports for insert
  with check (true);
