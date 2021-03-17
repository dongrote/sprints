FROM node:14-alpine AS server-builder
WORKDIR /usr/src/app
COPY api.ts/ .
RUN npm i
RUN npm run build
RUN rm -rf src

FROM node:14-alpine
WORKDIR /usr/src/app
COPY api.ts/package.json .
RUN npm i --only=production
COPY --from=server-builder /usr/src/app/dist/ /usr/src/app/dist/
RUN rm -rf .env db.sqlite
CMD npm start
