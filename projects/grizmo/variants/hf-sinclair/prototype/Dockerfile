FROM node:16-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY .yarn/ ./.yarn
COPY .yarnrc.yml ./
COPY .npmrc ./
COPY yarn.lock ./

ARG NPM_TOKEN
RUN yarn install
COPY . .
ARG APP_VERSION
RUN npm pkg set version="$(npm pkg get version --workspaces=false | tr -d '"').$APP_VERSION"
RUN yarn build


FROM node:16-alpine AS runner

RUN npm install --global serve

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/entrypoint.sh ./
COPY entrypoint.sh ./
ENV PORT=5000
EXPOSE 5000



RUN apk add --no-cache gettext

RUN chmod 755 entrypoint.sh

#Run entry point script to get env variables to FE
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

# Run the app
CMD ["npx", "serve", "-s", "build"]