# apple_server

This project is a Rust Axum HTTP server for interfacing with the AppleADay frontend.

It organizes files under the `src` directory, with the main application logic in `src/main.rs`.

```bash
apple_server/
├── Cargo.lock
├── Cargo.toml
├── CONTRIBUTING.md
└── src
    ├── db.rs
    ├── main.rs
    ├── routes.rs
    └── types.rs
```

The main.rs file registers routes and starts the Axum server.

HTTP routes handlers are defined in `src/routes.rs`. These are generic to both DB and general server side logic. 

Database interactions are handled in `src/db.rs`. If a function is defined here, it must have an appropriate route handler in `src/routes.rs` that it calls.

Special types and structures used across the application are defined in `src/types.rs`.

## Setup

To start the project, ensure you have Rust installed. Then run:

```bash
cargo build
```

Once the project is built, the server can be started with:

```bash
cargo run
```

A server will start on `localhost:3000` by default.
It will also attempt to connect to a PostgreSQL database at `localhost:5432` using hardcoded credentials.

You can change the database connection by defining the `DATABASE_URL` environment variable before running the server:

```bash
export DATABASE_URL="postgres://user:password@localhost:5432/dbname"
```

