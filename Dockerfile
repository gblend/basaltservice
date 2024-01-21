FROM node:18-alpine

RUN mkdir -p /src

WORKDIR /src

COPY package.json /src
# Prevent npm from executing arbitrary scripts
RUN npm config set ignore-scripts true

RUN npm ci && \
    # For development environment, we want to use nodemon to keep the code running
    npm install -g nodemon && \
    npm install -g pm2@5.3.0 \

RUN npm build

COPY ./dist /src

# Expose web service and nodejs debug port
EXPOSE  5000
EXPOSE  8585

CMD ["pm2-runtime", "src/ecosystem.config.js"]
