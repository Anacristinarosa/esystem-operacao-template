# eSystem Operação — Template

Template Next.js 15 + Supabase para a app operacional da founder.

Multi-tenant, dois papéis:

- **founder** — a consultora que oversee. Vive em `/admin`, vê todas as empresas, cria contas.
- **empresa** — a empresa cliente que usa a app no dia a dia. Vive em `/dashboard`, `/ocorrencias`, `/riscos`, `/acoes`, `/fornecedores`.

Cada empresa vê só os seus registos (RLS no Supabase). A founder vê tudo em modo leitura.

## Módulos (activáveis em `lib/config.ts`)

- **Ocorrências** — o que aconteceu e precisa de resposta. Severidade × frequência → prioridade calculada.
- **Riscos** — mapa vivo do que pode falhar. Probabilidade × impacto → nível calculado.
- **Ações** — correctivas, preventivas, de melhoria. Ligadas a ocorrências e riscos. Bloco de eficácia.
- **Fornecedores** — cadastro + avaliação periódica (qualidade / prazo / preço / comunicação).

Colaboradores servem como responsáveis atribuíveis.

## Correr em local

```bash
cp .env.example .env.local   # preencher com URL e chaves do Supabase
npm install
npm run dev
```

Depois abre `http://localhost:3000`.

## Base de dados

Cola `db/schema.sql` no SQL Editor do Supabase e corre uma vez. Cria as tabelas, RLS, trigger de perfis e a `empresas_view` para o admin.

## Onde afinar

- `lib/config.ts` — nome da app, âncora, módulos activos, estados, labels, tutora.
- `lib/prioridade.ts` — matrizes de cálculo.
- `app/globals.css` — paleta (creme + dourado).

## Skill

Construído pela skill `/esystem-operacao`. Corre a skill para adaptar o config à app da founder.
