<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# DOX Backoffice — Regras do projeto

## Plano canônico

`plans/roadmap/backoffice.md` na raiz do environment. Ler antes de qualquer feature nova.

## Stack

- Next.js 16 App Router (Turbopack)
- React 19
- TypeScript
- Tailwind CSS **v4** (sem `tailwind.config.*` — tokens vivem em `src/app/globals.css` via `@theme`)
- shadcn/ui (style `base-nova`, baseColor `neutral`, ícones Lucide)
- react-hook-form + zod (forms)
- @tanstack/react-table (tabelas)
- SWR + fetch nativo (HTTP client)

## Princípio

LITE por design. Adicionar feature SÓ quando dor real aparecer.

## Idioma

- UI, labels, mensagens de erro, placeholders: português brasileiro
- Variáveis, funções, interfaces, types: inglês
- Commits: português brasileiro

## Design system

Sistema portado de `dox-frontend-application` pra sintaxe v4:

- Brand: azul Apple (`brand-500 = #007AFF`)
- Cinzas quentes Apple (`gray-100 = #F5F5F7`, `gray-900 = #1D1D1F`)
- Status: success `#34C759`, warning `#FF9500`, danger `#FF3B30`
- Sombras multi-layer Apple (`shadow-card`, `shadow-dropdown`, `shadow-modal`)
- Fonte Inter via `next/font/google`
- Tokens semânticos shadcn (`--primary`, `--background`, etc.) mapeados pra paleta Apple

Tudo em `src/app/globals.css`.

## Regras

- NUNCA armazenar tokens em localStorage — sempre cookie httpOnly
- NUNCA logar dados sensíveis (senhas, tokens, PII de pacientes)
- Toda ação que muda dados deve registrar audit log no backend
- Componentes shadcn antes de criar custom
- Forms sempre com react-hook-form + zod
- Tabelas sempre com @tanstack/react-table
- Imports com alias `@/` (nunca `../` entre diretórios diferentes)
- NUNCA usar dark mode (decisão herdada do frontend — foi experimentado e revertido)
- NUNCA usar git worktree
- NUNCA adicionar dependências sem perguntar primeiro
- NUNCA criar arquivos `.md` sem ser solicitado

## Antes de commitar

1. `npm run build` — passa
2. `npm run lint` — zero erros
3. Atualizar plano em `plans/roadmap/backoffice.md` se features mudaram

## Commits

- Conventional commits em português: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`
- Sem `Co-Authored-By`, sem menção a Claude/Anthropic
- Branch naming: `feat/nome-curto`, `fix/nome-curto`
