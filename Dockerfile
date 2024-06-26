# https://kit.svelte.dev/docs/adapter-node
FROM node:lts-alpine as build

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine AS production

WORKDIR /app
COPY --from=build /app/build .
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .

RUN npm ci --omit dev
EXPOSE 3000
CMD ["node", "-r", "dotenv/config", "."]
