-- ============================================================
-- Schema da app eSystem Operação
-- Cola no SQL Editor do Supabase e corre uma vez.
-- Cria perfis + colaboradores + fornecedores + 4 módulos + RLS.
-- ============================================================

-- ─────────────── PERFIS (founder | empresa) ───────────────
-- founder = admin da plataforma (a consultora / criadora)
-- empresa = utilizador da empresa cliente (usa a app no dia a dia)

create table if not exists public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  role text not null default 'empresa' check (role in ('founder', 'empresa')),
  empresa_nome text,
  criado_em timestamptz not null default now()
);

alter table public.perfis enable row level security;

create policy "Cada um lê o próprio perfil"
  on public.perfis for select
  using (auth.uid() = id);

create policy "Founder lê todos os perfis"
  on public.perfis for select
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

create policy "Founder atualiza perfis"
  on public.perfis for update
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

-- Trigger para criar perfil automático ao registar utilizador novo
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfis (id, nome, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    'empresa'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────── COLABORADORES (por empresa) ───────────────

create table if not exists public.colaboradores (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  funcao text,
  email text,
  area text,
  data_entrada date,
  estado text not null default 'Activo' check (estado in ('Activo', 'Ausente', 'Desligado')),
  criado_em timestamptz not null default now()
);

create index if not exists idx_colaboradores_empresa on public.colaboradores(empresa_id);

alter table public.colaboradores enable row level security;

create policy "Empresa vê os seus colaboradores"
  on public.colaboradores for select
  using (auth.uid() = empresa_id);

create policy "Empresa gere os seus colaboradores"
  on public.colaboradores for all
  using (auth.uid() = empresa_id)
  with check (auth.uid() = empresa_id);

create policy "Founder vê todos os colaboradores"
  on public.colaboradores for select
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

-- ─────────────── FORNECEDORES (por empresa) ───────────────

create table if not exists public.fornecedores (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  categoria text,
  email text,
  telefone text,
  data_qualificacao date,
  estado text not null default 'Em qualificação',
  proxima_avaliacao date,
  observacoes text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists idx_fornecedores_empresa on public.fornecedores(empresa_id);
create index if not exists idx_fornecedores_estado on public.fornecedores(estado);

alter table public.fornecedores enable row level security;

create policy "Empresa vê os seus fornecedores"
  on public.fornecedores for select
  using (auth.uid() = empresa_id);

create policy "Empresa gere os seus fornecedores"
  on public.fornecedores for all
  using (auth.uid() = empresa_id)
  with check (auth.uid() = empresa_id);

create policy "Founder vê todos os fornecedores"
  on public.fornecedores for select
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

-- ─────────────── OCORRÊNCIAS ───────────────

create table if not exists public.ocorrencias (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  descricao text,
  origem text,
  severidade text check (severidade in ('Baixa', 'Média', 'Alta', 'Crítica')),
  frequencia text check (frequencia in ('Isolada', 'Ocasional', 'Recorrente', 'Constante')),
  prioridade text check (prioridade in ('Baixa', 'Média', 'Alta', 'Crítica')),
  colaborador_id uuid references public.colaboradores(id) on delete set null,
  fornecedor_id uuid references public.fornecedores(id) on delete set null,
  data_abertura date not null default current_date,
  prazo date,
  estado text not null default 'Aberto',
  data_reavaliacao date,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists idx_ocorrencias_empresa on public.ocorrencias(empresa_id);
create index if not exists idx_ocorrencias_estado on public.ocorrencias(estado);
create index if not exists idx_ocorrencias_prioridade on public.ocorrencias(prioridade);

alter table public.ocorrencias enable row level security;

create policy "Empresa vê as suas ocorrências"
  on public.ocorrencias for select
  using (auth.uid() = empresa_id);

create policy "Empresa gere as suas ocorrências"
  on public.ocorrencias for all
  using (auth.uid() = empresa_id)
  with check (auth.uid() = empresa_id);

create policy "Founder vê todas as ocorrências"
  on public.ocorrencias for select
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

-- ─────────────── RISCOS ───────────────

create table if not exists public.riscos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  descricao text,
  categoria text,
  probabilidade text check (probabilidade in ('Rara', 'Improvável', 'Possível', 'Provável', 'Quase certa')),
  impacto text check (impacto in ('Insignificante', 'Menor', 'Moderado', 'Maior', 'Catastrófico')),
  nivel text check (nivel in ('Aceitável', 'Tolerável', 'Elevado', 'Inaceitável')),
  colaborador_id uuid references public.colaboradores(id) on delete set null,
  data_revisao date,
  estado text not null default 'Identificado',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists idx_riscos_empresa on public.riscos(empresa_id);
create index if not exists idx_riscos_estado on public.riscos(estado);

alter table public.riscos enable row level security;

create policy "Empresa vê os seus riscos"
  on public.riscos for select
  using (auth.uid() = empresa_id);

create policy "Empresa gere os seus riscos"
  on public.riscos for all
  using (auth.uid() = empresa_id)
  with check (auth.uid() = empresa_id);

create policy "Founder vê todos os riscos"
  on public.riscos for select
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

-- ─────────────── AÇÕES ───────────────

create table if not exists public.acoes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  descricao text,
  tipo text check (tipo in ('Correctiva', 'Preventiva', 'Melhoria')),
  origem_ocorrencia_id uuid references public.ocorrencias(id) on delete set null,
  origem_risco_id uuid references public.riscos(id) on delete set null,
  colaborador_id uuid references public.colaboradores(id) on delete set null,
  prazo date,
  data_conclusao date,
  eficacia_data date,
  eficacia_veredicto text check (eficacia_veredicto in ('Eficaz', 'Não eficaz')),
  estado text not null default 'Definida',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists idx_acoes_empresa on public.acoes(empresa_id);
create index if not exists idx_acoes_estado on public.acoes(estado);

alter table public.acoes enable row level security;

create policy "Empresa vê as suas ações"
  on public.acoes for select
  using (auth.uid() = empresa_id);

create policy "Empresa gere as suas ações"
  on public.acoes for all
  using (auth.uid() = empresa_id)
  with check (auth.uid() = empresa_id);

create policy "Founder vê todas as ações"
  on public.acoes for select
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

-- ─────────────── AVALIAÇÕES DE FORNECEDOR ───────────────

create table if not exists public.avaliacoes_fornecedor (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references auth.users(id) on delete cascade,
  fornecedor_id uuid not null references public.fornecedores(id) on delete cascade,
  data date not null default current_date,
  nota_qualidade integer check (nota_qualidade between 1 and 5),
  nota_prazo integer check (nota_prazo between 1 and 5),
  nota_preco integer check (nota_preco between 1 and 5),
  nota_comunicacao integer check (nota_comunicacao between 1 and 5),
  nota_geral numeric(3, 2),
  observacoes text,
  decisao text check (decisao in ('Manter qualificado', 'Sob observação', 'Desqualificar')),
  criado_em timestamptz not null default now()
);

create index if not exists idx_avaliacoes_fornecedor on public.avaliacoes_fornecedor(fornecedor_id);

alter table public.avaliacoes_fornecedor enable row level security;

create policy "Empresa vê as suas avaliações"
  on public.avaliacoes_fornecedor for select
  using (auth.uid() = empresa_id);

create policy "Empresa gere as suas avaliações"
  on public.avaliacoes_fornecedor for all
  using (auth.uid() = empresa_id)
  with check (auth.uid() = empresa_id);

create policy "Founder vê todas as avaliações"
  on public.avaliacoes_fornecedor for select
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

-- ─────────────── VIEW: EMPRESAS (para o admin) ───────────────

create or replace view public.empresas_view as
select
  u.id,
  u.email,
  p.nome,
  p.empresa_nome,
  u.created_at as criada_em,
  u.last_sign_in_at as ultima_entrada,
  (select count(*) from public.ocorrencias o where o.empresa_id = u.id) as num_ocorrencias,
  (select count(*) from public.ocorrencias o where o.empresa_id = u.id and o.estado not in ('Fechado')) as ocorrencias_abertas,
  (select count(*) from public.riscos r where r.empresa_id = u.id and r.estado not in ('Fechado')) as riscos_activos,
  (select count(*) from public.acoes a where a.empresa_id = u.id and a.estado not in ('Fechada')) as acoes_pendentes
from auth.users u
join public.perfis p on p.id = u.id
where p.role = 'empresa'
order by u.created_at desc;
