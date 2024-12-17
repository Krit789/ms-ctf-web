FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

ENV NODE_ENV=production
ENV DATABASE_URL=
ENV NUXT_DATABASE_URL=
ENV NUXT_LDAP_SERVER=
ENV NUXT_LDAP_BIND=
ENV NUXT_LDAP_PASSWORD=
ENV NUXT_LDAP_USER_SEARCH_BASE=
ENV NUXT_JWT_SECRET=

EXPOSE 3000
CMD ["node", "./app/.output/server/index.mjs"]