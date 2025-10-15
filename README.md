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

### Autenticación y ruta protegida
- POST `http://localhost:3000/auth/token` emite un token de prueba.
- GET `http://localhost:3000/secure` requiere `Authorization: Bearer <token>` y devuelve el `userId` del token.

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

## Autenticación JWT (resumen)
El proyecto incluye configuración de JWT (módulo de Auth, estrategia `jwt`, y guard `JwtAuthGuard`).
- Para proteger rutas en el futuro, aplica el guard `JwtAuthGuard` en un controller/handler.
- Para emitir tokens, puedes usar el `AuthService` (ejemplo simple `issueToken(userId)`).

Nota: Por ahora el único endpoint público es `GET /example`. Las rutas protegidas se agregarán más adelante.

## Estándares y calidad
- Validación global con `ValidationPipe` (whitelist, forbidNonWhitelisted, transform)
- Linting con ESLint + Prettier

## Licencia
MIT
