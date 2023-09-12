FROM oven/bun

# Set working directory
WORKDIR /usr/app

# Copy package.json and package-lock.json before other files
COPY package*.json ./

RUN bun install

COPY . .

ENTRYPOINT ["bun", "run", "start"]