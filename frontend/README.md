# Plutus - Controle Financeiro Pessoal

Sistema para controle financeiro pessoal simples, permitindo registrar despesas e ganhos, sem login, para uso rápido no dia a dia.

## Tecnologias

- React 18.3.1
- TypeScript 5.6.3
- Vite 5.4.11
- TailwindCSS 3.4.14
- React Router DOM 6.26.2
- TanStack Query 5.59.20
- Zustand 5.0.1
- React Hook Form 7.53.1
- Zod 3.23.8

## Estrutura do Projeto

```
src/
├── app/                    # Configuração da aplicação
│   ├── App.tsx            # Componente raiz
│   ├── providers.tsx      # Provedores globais
│   └── router.tsx         # Configuração de rotas
├── pages/                 # Páginas da aplicação
│   ├── layouts/          # Layouts compartilhados
│   ├── Home/             # Página inicial
│   └── NotFound/         # Página 404
├── domain/               # Domínios de negócio
├── core/                 # Componentes e utilitários compartilhados
│   ├── components/       # Componentes genéricos
│   ├── lib/             # Configurações de bibliotecas
│   ├── utils/           # Funções utilitárias
│   └── types/           # Tipos globais
└── assets/              # Recursos estáticos
    └── styles/          # Estilos globais
```

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente conforme necessário.

## Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:5173

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Arquitetura

O projeto segue uma arquitetura modular baseada em domínios:

- **app/**: Configuração central da aplicação
- **pages/**: Componentes de página para roteamento
- **domain/**: Lógica de negócio organizada por domínio funcional
- **core/**: Componentes e utilitários reutilizáveis
- **assets/**: Recursos estáticos (estilos, imagens, etc.)

## Convenções

- Componentes em PascalCase
- Arquivos de implementação: `main.tsx`
- Arquivos de tipos: `types.ts`
- Arquivos de variantes: `variants.ts`
- Exports centralizados: `index.ts`
- Hooks customizados: prefixo `use`
- Serviços: sufixo `Service`

## Integração com Backend

O frontend está configurado para integrar com a API REST:

- **Base URL**: Configurável via `VITE_API_URL`
- **Endpoints públicos**: `/api/v1/external`
- **Endpoints autenticados**: `/api/v1/internal`

Clientes HTTP configurados em `src/core/lib/api.ts`.