# ---- Base Node image ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS deps
RUN npm ci || npm install

# ---- Build ----
FROM base AS build
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate
RUN npm run build

# ---- Production ----
FROM node:20-alpine AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/src/main.js"]
