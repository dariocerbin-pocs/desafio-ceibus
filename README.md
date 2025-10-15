# Desafío Ceibus - API REST con NestJS

Proyecto base (scaffolding) de una API REST construida con NestJS (TypeScript), validación global, autenticación JWT y ejecución mediante Docker.

## Requisitos
- Node.js 18+ (recomendado 20)
- npm 9+
- Docker y Docker Compose (opcional para ejecución en contenedor)

## Estructura del proyecto
```
src/
  app/
    app.module.ts
  auth/
    auth.module.ts
    auth.service.ts
    jwt.strategy.ts
    jwt-auth.guard.ts
  example/
    example.module.ts
    example.controller.ts
    example.service.ts
    example.repository.ts
  main.ts
config/
  configuration.ts
```

## Instalación y ejecución local
1) Instalar dependencias:
```bash
npm i
```
2) Compilar TypeScript:
```bash
npm run build
```
3) Ejecutar la app:
```bash
npm start
```
La API quedará disponible en `http://localhost:3000`.

### Endpoint de prueba
- GET `http://localhost:3000/example`

Prueba rápida:
```bash
curl http://localhost:3000/example
```

### Autenticación y rutas protegidas
- POST `POST /auth/register` (registro con bcrypt, devuelve access token)
- POST `POST /auth/login` (login con bcrypt, devuelve access token)
- GET `GET /auth/me` (JWT)
- GET `GET /users/me` (JWT)
- GET `GET /secure` (JWT de prueba)

Ejemplo rápido:
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/auth/token | jq -r .access_token)
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/secure
```

## Variables de entorno
Copiar el archivo `.env.example` a `.env` y ajustar valores:
```
PORT=3000
JWT_SECRET=please_change_me
JWT_EXPIRES_IN=1h
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ceibus-commerce?schema=public
```

## Scripts útiles
- `npm run build`: compila a `dist/`
- `npm start`: ejecuta `node dist/src/main.js`
- `npm run start:dev`: ejecuta en modo desarrollo con ts-node
- `npm run start:debug`: ejecuta con inspector de Node
- `npm run lint`: corre ESLint
- `npm run format`: corre Prettier

## Docker
Construir y levantar con Docker Compose:
```bash
docker compose up --build
```
La API quedará disponible en `http://localhost:3000`.

Variables inyectadas por Compose (puedes sobreescribir vía entorno):
- `JWT_SECRET` (default: `please_change_me`)
- `JWT_EXPIRES_IN` (default: `1h`)
- `DATABASE_URL` (default: `postgresql://postgres:postgres@db:5432/ceibus-commerce?schema=public`)

## Prisma ORM (PostgreSQL)
- Esquema: `prisma/schema.prisma`
- Scripts:
  - `npm run prisma:generate` genera Prisma Client
  - `npm run prisma:migrate` crea/ejecuta migraciones (usa la BD de `DATABASE_URL`)
  - `npm run prisma:studio` abre Prisma Studio

Pasos iniciales:
```bash
cp .env.example .env
docker compose up -d db
npm run prisma:generate
npm run prisma:migrate -- --name init
```

## Roles y permisos
- ADMIN:
  - CRUD de productos (`POST/PATCH/DELETE /products/:id`, `POST /products`)
  - Ver todos los pedidos y cambiar estado (`GET /orders?status=`, `PATCH /orders/:id/status`)
- USER:
  - Crear pedidos (`POST /orders`)
  - Ver sus propios pedidos (`GET /orders`)

## Swagger
Documentación interactiva en `http://localhost:3000/docs` con esquema y auth Bearer.

## Autenticación JWT (resumen)
El proyecto incluye configuración de JWT (módulo de Auth, estrategia `jwt`, y guard `JwtAuthGuard`).
- Para proteger rutas en el futuro, aplica el guard `JwtAuthGuard` en un controller/handler.
- Para emitir tokens, puedes usar el `AuthService` (ejemplo simple `issueToken(userId)`).

Nota: Por ahora el único endpoint público es `GET /example`. 

## Estándares y calidad
- Validación global con `ValidationPipe` (whitelist, forbidNonWhitelisted, transform)
- Linting con ESLint + Prettier

## Licencia
MIT
