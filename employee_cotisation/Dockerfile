# version of node to use
FROM node:15.4.0-alpine 
# define working directory for docker
WORKDIR /usr/src/app

ENV APPENV=production

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# install npm dependencies and pm2
RUN npm install --only=production && npm i -f -g pm2
# Install production dependencies.
# RUN npm install --only=production
# copy all our source code into the working directory
COPY . ./
# expose port 3000 for our server to run on
EXPOSE 9000
# command to start our server
CMD ["pm2-runtime", "start", "index.js" ]
# Run the web service on container startup.
# CMD [ "npm", "start" ]