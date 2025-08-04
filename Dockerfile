FROM node:20.19.1-alpine3.21 as builder

RUN apk add --no-cache python3 make g++ gcc libc-dev linux-headers

WORKDIR /build
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

RUN corepack enable
RUN yarn set version 4.9.2

RUN yarn install

COPY . .
RUN yarn build

FROM nginx:1.28.0-alpine3.21-slim
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
