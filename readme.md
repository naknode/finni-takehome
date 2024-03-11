# finni

New and improved patient portal using workspaces!

**pnpm** is a fast, improved package manager. pnpm creates hard links from the global store to the project's node_modules folders. Hard links point to the same place on the disk where the original files are. You save disk spaces and it's faster!

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

- `pnpm run start`: Start the client and server concurrently
- `pnpm run build`: Build both the client and server during the CI/CD phase
