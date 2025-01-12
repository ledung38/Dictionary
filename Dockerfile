FROM node:20.11.1-alpine as builder
WORKDIR /sign_school-space

COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:20.11.1-alpine as runner
WORKDIR /sign_school-space
COPY --from=builder /sign_school-space/package.json .
COPY --from=builder /sign_school-space/node_modules ./node_modules
COPY --from=builder /sign_school-space/.next ./.next
COPY --from=builder /sign_school-space/messages ./messages
COPY --from=builder /sign_school-space/public ./public

CMD npm run start