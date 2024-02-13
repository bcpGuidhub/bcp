# build environment
FROM node:16.3-alpine3.12 as build
RUN export NODE_OPTIONS="--max-old-space-size=8192" #increase to 8gb
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci 
RUN npm i gzipper -g
RUN npm install react-scripts@latest -g --silent
RUN npm install -g env-cmd
RUN npx browserslist@latest --update-db
COPY . ./
RUN npm run build:staging
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]