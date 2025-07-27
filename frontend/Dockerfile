# Important, context needs to be set to the root of the monorepo
FROM nikolaik/python-nodejs:python3.13-nodejs22 AS builder

WORKDIR /app

COPY ./backend .

WORKDIR /app/backend
RUN python -m venv /app/.venv
RUN source /app/.venv/bin/activate
RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /app
COPY ./frontend .
WORKDIR ./frontend
# This also builds the types
RUN npm install
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY ./frontend .
COPY --from=builder /app/frontend/node_modules /app/frontend/node_modules
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next ./app/.next
COPY --from=builder /app/frontend/node_modules ./app/node_modules
COPY --from=builder /app/frontend/package.json ./app/package.json
COPY --from=builder /app/frontend/public ./app/public

USER nextjs


CMD ["node", "server.js"]