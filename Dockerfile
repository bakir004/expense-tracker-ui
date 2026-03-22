# syntax=docker/dockerfile:1

# --- Install dependencies (cached layer when lockfile unchanged) ---
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.16.1 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- Build static assets (Vite embeds VITE_* at build time) ---
FROM deps AS build
COPY . .

ARG VITE_API_URL=/api
ARG VITE_API_VERSION=v1
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_VERSION=$VITE_API_VERSION

RUN pnpm build

# --- Serve SPA + reverse-proxy API (see nginx.conf) ---
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
