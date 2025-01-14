FROM node:20.17.0-alpine as builder
WORKDIR /sign-school-space

RUN npm install -g npm@11.0.0

COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:20.11.1-alpine as runner
WORKDIR /sign-school-space
COPY --from=builder /sign-school-space/package.json .
COPY --from=builder /sign-school-space/node_modules ./node_modules
COPY --from=builder /sign-school-space/.next ./.next
# COPY --from=builder /sign-school-space/messages ./messages
COPY --from=builder /sign-school-space/public ./public

CMD npm run start