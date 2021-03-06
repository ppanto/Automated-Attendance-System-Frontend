FROM node:15.8.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.4 -g --silent
COPY . ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY certi/cert.pem /certi/cert.pem
COPY certi/chain.pem /certi/chain.pem
COPY certi/fullchain.pem /certi/fullchain.pem
COPY certi/options-ssl-nginx.conf /certi/options-ssl-nginx.conf
COPY certi/ssl-dhparams.pem /certi/ssl-dhparams.pem
COPY certi/privkey.pem /certi/privkey.pem

EXPOSE 3001 3002
CMD ["nginx", "-g", "daemon off;"]
