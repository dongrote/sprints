FROM node:14-alpine AS server-builder
WORKDIR /usr/src/app
COPY api/package.json .
RUN npm i --only=production

FROM node:14-alpine
WORKDIR /usr/src/app
COPY api/ .
COPY --from=server-builder /usr/src/app/ .
RUN rm -rf .env db.sqlite
CMD npm start
