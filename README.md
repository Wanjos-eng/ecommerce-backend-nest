<!-- PROJECT_METADATA
{
  "title": "E-commerce Backend (NestJS)",
  "short_description": "Backend escalável para e-commerce construído com NestJS e TypeScript, com autenticação via JWT, OAuth (Google/GitHub) e arquitetura modular.",
  "primary_stack": ["NestJS", "TypeScript", "PostgreSQL", "TypeORM", "JWT", "Passport.js"],
  "architecture": "REST API",
  "detail_description": "API backend para plataforma de e-commerce desenvolvida com NestJS seguindo arquitetura modular. Implementa autenticação completa com JWT local, OAuth via Google e GitHub (Passport.js), módulo de usuário com DTOs tipados, módulo admin com controle de acesso, e persistência com TypeORM + PostgreSQL. Configuração centralizada de ambiente e JWT com dotenv, e guards customizados para proteção de rotas."
}
-->

# E-commerce Backend — NestJS

Backend escalável para plataforma de e-commerce, construído com NestJS e TypeScript. Foco em autenticação robusta, arquitetura modular e boas práticas de API.

## Módulos

| Módulo | Responsabilidade |
|---|---|
| `auth` | Autenticação JWT local + OAuth (Google, GitHub via Passport.js) |
| `user` | Gestão de usuários com DTOs tipados e entidades TypeORM |
| `admin` | Endpoints e controle de acesso administrativo |

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | NestJS (Node.js) |
| Linguagem | TypeScript |
| Autenticação | JWT + Passport.js (estratégias local, Google, GitHub) |
| ORM | TypeORM |
| Banco de Dados | PostgreSQL |
| Config | dotenv com configuração centralizada |

## Estrutura do Projeto

```
src/
├── modules/
│   ├── auth/           # Auth controller, service, DTOs, guards e strategies
│   ├── user/           # User controller, service, entity, DTOs
│   └── admin/          # Admin controller, service
├── config/             # Configuração de JWT, TypeORM e dotenv
└── main.ts             # Bootstrap da aplicação
```

## Como Rodar

### Pré-requisitos
- Node.js 18+ e npm
- PostgreSQL

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## Variáveis de Ambiente

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```
