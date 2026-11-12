FROM node:22-alpine

WORKDIR /app
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
RUN npm ci

COPY backend ./backend
RUN npm run build --workspace backend

ENV NODE_ENV=production
EXPOSE 4000
USER node
CMD ["npm", "run", "start", "--workspace", "backend"]
