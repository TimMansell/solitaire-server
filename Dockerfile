FROM node:14

ENV PORT=80

# Copy source code
COPY . /app

# Change working directory
WORKDIR /app

# Install dependencies
RUN yarn

# Build application
RUN yarn build

# Expose API port to the outside
EXPOSE 80

# Launch application
CMD ["yarn","start"]