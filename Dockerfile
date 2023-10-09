# Install dependencies only when needed
FROM node:16.13.0-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
COPY .npmrc ./
RUN cat .npmrc
RUN npm install --production


# Rebuild the source code only when needed
FROM node:16.13.0-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS --max_old_space_size=5120
COPY --from=deps /app/node_modules ./node_modules
COPY . ./
# RUN export NODE_OPTIONS=--openssl-legacy-provider
RUN export NODE_OPTIONS=--experimental-specifier-resolution=node
RUN npm run build

# Production image, copy all the files and run next
FROM node:16.13.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
#RUN npm install --global pm2
#RUN sed -i 's/pidusage(pids, function retPidUsage(err, statistics) {/pidusage(pids, { usePs: true }, function retPidUsage(err, statistics) {/' /usr/local/lib/node_modules/pm2/lib/God/ActionMethods.js

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3001

ENV PORT 3001

# Run npm start script with PM2 when container starts
CMD [ "npm", "start" ]
