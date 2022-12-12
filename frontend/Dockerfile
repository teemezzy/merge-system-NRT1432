FROM node:16-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/
RUN yarn 
RUN yarn add -D @swc/cli @swc/core
COPY . .

ARG ENVIRONMENT
ENV NEXT_PUBLIC_ENVIRONMENT=$ENVIRONMENT
ENV ENVIRONMENT=$ENVIRONMENT

ARG API_URL
ENV NEXT_PUBLIC_API_URL=$API_URL
ENV API_URL=$API_URL

RUN npx browserslist@latest --update-db
RUN yarn build
CMD ["yarn", "start"]
