# bun-discord-bot

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

To dev:
```bash
bun run dev
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Docker

### Development

```bash
docker compose up
```

### Production

```bash
docker compose -f docker-compose.dev.yaml up
```

## Commands

Create new command by duplicating `commands/test.ts` and replace `<command-name>` accordingly in the file.