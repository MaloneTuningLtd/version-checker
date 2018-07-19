# Use full image to download and install any dependencies
# May need to install basic build dependencies for node-gyp
FROM mhart/alpine-node:8
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

# Copy over node_modules to smaller image
# And use this as the base image for our application
FROM mhart/alpine-node:base-8
WORKDIR /app
COPY --from=0 /app .
COPY . .
CMD ["node", "index.js"]
