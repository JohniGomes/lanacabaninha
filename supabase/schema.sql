create table eventos (
  id text primary key,
  aniversariante text not null,
  idade integer,
  "contatoNome" text not null,
  "contatoTelefone" text,
  "contatoEmail" text,
  endereco text not null,
  data text not null,
  horario text not null,
  tema text not null,
  caminho text not null check (caminho in ('personalizada', 'assinada')),
  "colecaoId" text,
  "corFavorita" text,
  "corNaoGosta" text,
  "naoPodeFaltar" text,
  "responsavelMontagem" text,
  "horarioRecreacao" text,
  "horarioSpa" text,
  observacoes text,
  checklist jsonb not null default '[]'::jsonb,
  "contratoAceito" boolean not null default false,
  "contratoAceitoEm" text,
  "cpfContratante" text,
  "rgContratante" text,
  "quantidadeCabanas" integer,
  "valorContrato" numeric(12,2),
  "formaPagamento" text,
  "itensAlugados" text,
  "itensAdicionais" text
);

create table financeiro (
  id text primary key,
  descricao text not null,
  categoria text not null,
  tipo text not null check (tipo in ('receita', 'despesa')),
  valor numeric(12,2) not null,
  data text not null,
  "eventoId" text,
  "fornecedorId" text
);

create table fornecedores (
  id text primary key,
  nome text not null,
  categoria text not null,
  contato text
);

create table estoque (
  id text primary key,
  categoria text not null,
  nome text not null,
  quantidade integer not null default 0,
  nota text
);

create table usuarios (
  email text primary key,
  senha text not null,
  role text not null check (role in ('admin', 'colaborador'))
);
create unique index usuarios_email_ci_idx on usuarios (lower(email));

alter table eventos enable row level security;
alter table financeiro enable row level security;
alter table fornecedores enable row level security;
alter table estoque enable row level security;
alter table usuarios enable row level security;
-- Nenhuma policy criada de propósito: só a chave service_role (usada pelo backend
-- do app, nunca pelo navegador) acessa essas tabelas.
