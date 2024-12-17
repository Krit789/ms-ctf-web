FROM node:22-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set production environment for build
ENV NODE_ENV=production

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod=false 

COPY . .

RUN pnpm build

FROM node:22-alpine

RUN apk add --no-cache tzdata

ENV TZ=Asia/Bangkok
ENV NODE_ENV=production

WORKDIR /app
COPY --from=builder /app/.output/public ./.output/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV DATABASE_URL
ENV NUXT_DATABASE_URL
ENV NUXT_LDAP_SERVER
ENV NUXT_LDAP_BIND
ENV NUXT_LDAP_PASSWORD
ENV NUXT_LDAP_USER_SEARCH_BASE
ENV NUXT_JWT_SECRET

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]