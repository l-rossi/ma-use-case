# Important, context needs to be set to the root of the monorepo
FROM nikolaik/python-nodejs:python3.13-nodejs24-alpine AS builder

WORKDIR /app

COPY ./backend /app/backend

WORKDIR /app/backend
RUN python -m venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

COPY ./frontend /app/frontend
WORKDIR /app/frontend

ARG NEXT_PUBLIC_BACKEND_URL
# Yes, this is safe, this is placed in the public build anyways.
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# This also builds the types
RUN npm install
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static

USER nextjs

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]