FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/www /usr/share/nginx/html   
# adapt path if 'build' not 'www'
# copy custom nginx.conf if you need to handle /api proxy or websocket upgrades
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
