FROM node:14.18.0

ENV NODE_ENV=production
ENV PORT=80

# Copy source code
COPY . /app

# Change working directory
WORKDIR /app

# Install dependencies
RUN yarn --frozen-lockfile

# Expose API port to the outside
EXPOSE 80

# Launch application
CMD ["node","--experimental-specifier-resolution=node","./src/main.js"]