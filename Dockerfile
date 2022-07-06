FROM node:14.18.0

ARG NODE_ENV=production

ENV NODE_ENV=$NODE_ENV
ENV PORT=8080

# Copy source code
COPY . /app

# Change working directory
WORKDIR /app

# Install dependencies
RUN yarn --frozen-lockfile

# Expose API port to the outside
EXPOSE 8080

# Launch application
CMD ["node","--experimental-specifier-resolution=node","./src/main.js"]