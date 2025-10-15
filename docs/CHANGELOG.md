# Bitácora de Cambios (CHANGELOG)

Este documento registra los pasos realizados y las funcionalidades agregadas al proyecto. Con cada cambio significativo, añadir una nueva entrada al inicio del listado con la fecha correspondiente.

## [2025-10-15] Scaffold inicial de API NestJS
- Inicialización del proyecto Node (`npm init -y`).
- Configuración TypeScript: `tsconfig.json` y `tsconfig.build.json`.
- Configuración de Nest CLI: `nest-cli.json`.
- Configuración de ESLint y Prettier: `.eslintrc.js`, `.prettierrc`.
- Bootstrap Nest con validación global (`ValidationPipe`) en `src/main.ts`.
- `AppModule` con `ConfigModule` global y carga de `configuration.ts`.
- Módulo de ejemplo `ExampleModule` con estructura Controller/Service/Repository:
  - `GET /example` devuelve un mensaje básico.
- Autenticación JWT:
  - `AuthModule` con `JwtModule`, `PassportModule`.
  - `JwtStrategy` y `JwtAuthGuard`.
  - `AuthService` con método `issueToken` (uso demostrativo).
- Variables de entorno de ejemplo: `.env.example`.
- Configuración Docker:
  - `Dockerfile` multi-stage (deps, build, prod).
  - `docker-compose.yml` para levantar la API.
  - `.dockerignore` para reducir el contexto de build.
- Scripts y dependencias en `package.json`:
  - Scripts: `build`, `start`, `start:dev`, `start:debug`, `lint`, `format`.
  - Dependencias Nest, JWT, Passport, Config y utilidades de lint/format/TS.
  - Tipos añadidos: `@types/passport`, `@types/passport-jwt`.
- Build verificado exitosamente (`npm run build`).
- Documentación inicial: `README.md` con instrucciones de instalación, ejecución local, Docker y endpoint de prueba.

## [2025-10-15] Endpoints de autenticación y ruta segura
- `AuthController` con `POST /auth/token` para emitir un token de prueba.
- `SecureModule` y `SecureController`:
  - `GET /secure` protegido con `JwtAuthGuard`, devuelve `userId` del token.
- `AppModule` actualizado para importar `SecureModule`.
- `README.md` actualizado con ejemplo de uso del token y ruta segura.

## [2025-10-15] Integración Prisma + PostgreSQL
- Dependencias: `prisma` (dev) y `@prisma/client`.
- Scripts añadidos: `prisma:generate`, `prisma:migrate`, `prisma:studio`.
- `prisma/schema.prisma` con modelos: `User`, `Product`, `Order`, `OrderItem` y enums `Role`, `OrderStatus`.
- `PrismaModule` y `PrismaService` para DI en NestJS (global).
- `docker-compose.yml` extendido con servicio `db` (PostgreSQL 16) y volumen `pgdata`.
- `.env.example` actualizado con `DATABASE_URL`.
- `README.md` con pasos para generar cliente y correr migraciones.

---

Procedimiento para futuras actualizaciones:
1. Describir brevemente la funcionalidad añadida y su motivación.
2. Listar los archivos modificados/creados más relevantes.
3. Añadir comandos de uso o pasos de despliegue si aplica.
4. Incluir notas de migración o breaking changes si corresponde.
