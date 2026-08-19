# Etapa 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar OpenSSL requerido por Prisma Client en Alpine
RUN apk add --no-cache openssl

# Copiar package.json y directorio prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias (dev + prod)
RUN npm install

# Copiar código fuente
COPY . .

# Generar cliente de Prisma y compilar TypeScript
RUN npx prisma generate
RUN npm run build

# Etapa 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Instalar OpenSSL para tiempo de ejecución
RUN apk add --no-cache openssl

ENV NODE_ENV=production

# Copiar manifiesto de dependencias y esquema prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instalar solo dependencias de producción y cliente de Prisma
RUN npm install --omit=dev && npx prisma generate

# Copiar archivos compilados desde builder
COPY --from=builder /app/dist ./dist

# Exponer puerto 3000
EXPOSE 3000

# Ejecutar la aplicación compilada
CMD ["node", "dist/index.js"]
