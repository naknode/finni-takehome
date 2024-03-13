# finni

New and improved patient portal using workspaces!

Before we start, this project uses pnpm instead of npm.

**pnpm** is a fast, improved package manager. pnpm creates hard links from the global store to the project's node_modules folders. Hard links point to the same place on the disk where the original files are. You save disk space and it's faster than npm!

- `/server`
  - esno (alias of `tsx`) to build and develop the TypeScript server
  - fastify: Node.js framework to write beautiful async code
  - Prisma: the best experience working with databases while using a declarative schema
  - pm2: manage production node.js clusters and more easily
- `/client`
  - vue: one of the top frameworks to build web apps
  - auth0: easy user management and authentication
  - ag-grid: list tabular data with many features like sorting, filtering and more

### Scripts

We utilize pnpm workspaces to better unify the CI/CD procedures for the front and backend.

- `pnpm run build`: To run the builds of the TypeScript API server and Vue 3 front-end
- `pnpm run dev`: To concurrently run the backend and front-end
- `pnpm run start`: To run the servers from their production-built mode

#### Getting Started

- Create the database `finnitakehome` in PostgreSQL.

- Install pnpm `npm install -g pnpm`.

- In root folder: run `pnpm install`.

- Go to `/server` folder, and update the `.env` file from the `.env.template` file with your PostgreSQL credentials and table.

- Then run `./node_modules/.bin/prisma generate`, to generate the Prisma schema/files needed.

- Then run `pnpm exec prisma migrate dev --name init` to create the tables with the schemas on the database.

- Back in the root folder, run `pnpm dev` and you're good to go.

> (Optional): Run `pnpm run prisma:seed` in `/server` to generate example data
