<!-- PROJECT_METADATA
{
  "title": "E-commerce Backend (NestJS)",
  "short_description": "Backend modular NestJS com autenticação OAuth2 completa (Google + GitHub + JWT local), TypeORM, PostgreSQL e arquitetura orientada a módulos.",
  "primary_stack": ["NestJS", "TypeScript", "PostgreSQL", "TypeORM", "Passport.js", "JWT"],
  "architecture": "REST API",
  "detail_description": "API backend de e-commerce construída com NestJS e TypeScript seguindo arquitetura modular rigorosa. O ponto de maior interesse técnico é o sistema de autenticação triplo: autenticação local com JWT (bcrypt + access/refresh tokens), OAuth via Google (Passport.js GoogleStrategy com callback PKCE) e OAuth via GitHub (GitHubStrategy). Cada estratégia é um módulo independente que implementa `PassportStrategy`, compartilhando apenas o serviço de usuário para criação/lookup. O módulo de usuário usa TypeORM com entities decoradas e DTOs com validação via `class-validator`. O módulo admin implementa guards customizados com verificação de role extraída do JWT payload. Toda a configuração (JWT secret, credenciais OAuth, DATABASE_URL) é centralizada via módulos de configuração com `@nestjs/config` e validação de schema no bootstrap.",
  "images": [],
  "cover_image": "",
  "live_url": ""
}
-->

# E-commerce Backend — NestJS

Backend modular de e-commerce com autenticação JWT local + OAuth2 completo (Google e GitHub via Passport.js).

## Módulos

| Módulo | Responsabilidade |
|---|---|
| `auth` | 3 estratégias: JWT local, Google OAuth, GitHub OAuth |
| `user` | Entidade TypeORM, DTOs validados, CRUD de perfil |
| `admin` | Guards por role extraída do JWT payload |

## Autenticação

```
POST /auth/login         → JWT local (email + senha bcrypt)
GET  /auth/google        → Redirect Google OAuth PKCE
GET  /auth/google/callback
GET  /auth/github
GET  /auth/github/callback
```

## Stack

NestJS + TypeScript | Passport.js | TypeORM | PostgreSQL | JWT | Docker
