-- Core enums
create type public.link_status as enum ('active','paused','archived');
create type public.app_role as enum ('admin','moderator','user');

-- Roles table (for secure admin gating)
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create policy "Users can view their roles"
on public.user_roles
for select
to authenticated
using (user_id = auth.uid());

-- Workspaces
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  name text not null default 'My workspace',
  plan_tier text not null default 'free',
  settings jsonb not null default '{}'::jsonb,
  gtm_container_id text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;

create policy "Workspace owners can select"
on public.workspaces
for select
to authenticated
using (owner_id = auth.uid());

create policy "Users can create their own workspace"
on public.workspaces
for insert
to authenticated
with check (owner_id = auth.uid());

create policy "Workspace owners can update"
on public.workspaces
for update
to authenticated
using (owner_id = auth.uid());

create policy "Workspace owners can delete"
on public.workspaces
for delete
to authenticated
using (owner_id = auth.uid());

-- Links
create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null,
  title text null,
  short_url text null,
  destination_url text not null,
  domain text null,
  slug text null,
  status public.link_status not null default 'active',
  total_clicks integer not null default 0,
  clicks_last_30_days integer not null default 0,
  geo_targets jsonb null,
  security_status text not null default 'not_scanned',
  expires_at timestamptz null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  utm_term text null,
  utm_content text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_links_workspace_id on public.links(workspace_id);
create index if not exists idx_links_created_by on public.links(created_by);
create index if not exists idx_links_status on public.links(status);

alter table public.links enable row level security;

create policy "Workspace owners can view links"
on public.links
for select
to authenticated
using (
  exists (
    select 1 from public.workspaces w
    where w.id = links.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Workspace owners can create links"
on public.links
for insert
to authenticated
with check (
  exists (
    select 1 from public.workspaces w
    where w.id = links.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Workspace owners can update links"
on public.links
for update
to authenticated
using (
  exists (
    select 1 from public.workspaces w
    where w.id = links.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Workspace owners can delete links"
on public.links
for delete
to authenticated
using (
  exists (
    select 1 from public.workspaces w
    where w.id = links.workspace_id
      and w.owner_id = auth.uid()
  )
);

-- UTM templates
create table if not exists public.utm_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null,
  name text not null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  utm_term text null,
  utm_content text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_utm_templates_workspace_id on public.utm_templates(workspace_id);

alter table public.utm_templates enable row level security;

create policy "Workspace owners can view utm templates"
on public.utm_templates
for select
to authenticated
using (
  exists (
    select 1 from public.workspaces w
    where w.id = utm_templates.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Workspace owners can create utm templates"
on public.utm_templates
for insert
to authenticated
with check (
  exists (
    select 1 from public.workspaces w
    where w.id = utm_templates.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Workspace owners can update utm templates"
on public.utm_templates
for update
to authenticated
using (
  exists (
    select 1 from public.workspaces w
    where w.id = utm_templates.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Workspace owners can delete utm templates"
on public.utm_templates
for delete
to authenticated
using (
  exists (
    select 1 from public.workspaces w
    where w.id = utm_templates.workspace_id
      and w.owner_id = auth.uid()
  )
);

-- QR codes
create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null references public.workspaces(id) on delete set null,
  link_id uuid not null references public.links(id) on delete cascade,
  created_by uuid not null,
  name text not null,
  variant_name text null,
  primary_color text null,
  secondary_color text null,
  corner_style text null,
  frame_text text null,
  has_logo boolean not null default false,
  png_url text null,
  svg_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_qr_codes_link_id on public.qr_codes(link_id);

alter table public.qr_codes enable row level security;

create policy "Workspace owners can view qr codes"
on public.qr_codes
for select
to authenticated
using (
  workspace_id is null or exists (
    select 1 from public.workspaces w
    where w.id = qr_codes.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Workspace owners can create qr codes"
on public.qr_codes
for insert
to authenticated
with check (
  workspace_id is null or exists (
    select 1 from public.workspaces w
    where w.id = qr_codes.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Workspace owners can update qr codes"
on public.qr_codes
for update
to authenticated
using (
  workspace_id is null or exists (
    select 1 from public.workspaces w
    where w.id = qr_codes.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Workspace owners can delete qr codes"
on public.qr_codes
for delete
to authenticated
using (
  workspace_id is null or exists (
    select 1 from public.workspaces w
    where w.id = qr_codes.workspace_id
      and w.owner_id = auth.uid()
  )
);

-- Feedback (insert-only from authenticated users)
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  message text not null,
  type text not null default 'other',
  category text null,
  priority text null,
  page_url text null,
  status text not null default 'new',
  screenshot_url text null,
  browser_info jsonb null,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

create policy "Users can submit feedback"
on public.feedback
for insert
to authenticated
with check (user_id = auth.uid());

-- Feature gates registry (public read)
create table if not exists public.feature_gates (
  id uuid primary key default gen_random_uuid(),
  feature_key text not null unique,
  min_plan_tier text not null default 'free',
  description text null,
  created_at timestamptz not null default now()
);

alter table public.feature_gates enable row level security;

create policy "Feature gates are publicly readable"
on public.feature_gates
for select
using (true);

create policy "Admins can manage feature gates"
on public.feature_gates
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Security event logging for ErrorBoundary
create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  user_id uuid null,
  metadata jsonb null,
  created_at timestamptz not null default now()
);

alter table public.security_events enable row level security;

create policy "Admins can view security events"
on public.security_events
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "System can insert security events"
on public.security_events
for insert
to authenticated
with check (true);

create or replace function public.log_security_event(
  p_event_type text,
  p_user_id uuid,
  p_metadata jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.security_events(event_type, user_id, metadata)
  values (p_event_type, p_user_id, p_metadata);
end;
$$;

-- updated_at trigger function exists: public.handle_updated_at
-- add triggers where needed
create trigger workspaces_set_updated_at
before update on public.workspaces
for each row execute function public.handle_updated_at();

create trigger links_set_updated_at
before update on public.links
for each row execute function public.handle_updated_at();

create trigger utm_templates_set_updated_at
before update on public.utm_templates
for each row execute function public.handle_updated_at();

create trigger qr_codes_set_updated_at
before update on public.qr_codes
for each row execute function public.handle_updated_at();
