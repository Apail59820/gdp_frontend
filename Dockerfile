# Install dependencies only when needed
FROM node:16.13.0-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
COPY .npmrc ./
RUN cat .npmrc
RUN npx google-artifactregistry-auth .npmrc
RUN npm install


# Rebuild the source code only when needed
FROM node:16.13.0-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS --max_old_space_size=4096
COPY --from=deps /app/node_modules ./node_modules
COPY . ./
# RUN export NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

# Production image, copy all the files and run next
FROM node:16.13.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
#RUN npm install --global pm2
#RUN sed -i 's/pidusage(pids, function retPidUsage(err, statistics) {/pidusage(pids, { usePs: true }, function retPidUsage(err, statistics) {/' /usr/local/lib/node_modules/pm2/lib/God/ActionMethods.js

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER node

EXPOSE 3001

# Run npm start script with PM2 when container starts
CMD [ "npm", "start" ]
