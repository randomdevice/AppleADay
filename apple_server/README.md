# Apple Server

The `apple_server` application serves and API server used by the `apple_client` web app through a Postgres Database.

The codebase is organized into 4 files under `src/`:
- `routes.rs`: contains route handlers and configures endpoints and OpenAPI documenation.
- `types.rs`: contains strict types for query inputs.
- `db.rs`: contains functions that send SQL queries to a postgres database, called by route handlers.
- `main.rs`: contains the route handler server, registers routes, and runs main application loop.
