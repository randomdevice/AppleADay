# AppleADay

AppleADay is a public health application that aggregates statistics on health habits and disease data between various times, demographics, and locations. 

The following project is organized into several folders:
- **apple_client**: The client-side application that users interact with.
- **apple_server**: The server-side application that handles data storage and processing.
- **data_preprocessing**: Jupyter notebooks and Python scripts for preparing and cleaning database data before it is uploaded to a DBMS.

## Development Dependencies

This repository requires the following dependencies to be installed/setup in order to develop:

- Cargo and Rust (for the server-side application) (install: [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install))
- Node.js and npm (for the client-side application) (install: [https://nodejs.org/en/download](https://nodejs.org/en/download))
- PostgreSQL (for the database) 
  - You can pull a docker image to setup a local instance 
    `docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres`
    , and set DATABASE_URL=postgresql://postgres:postgres@localhost/appleaday)

## General Setup and Building

This application requires:
- a Postgres server, with the data loaded from the CSVs in data_preprocessing/preprocessed_data under the database name provided in `DATABASE_URL`.
- Rust and Cargo installed (for compiling the apple_server binary)
- NodeJS installed (for building the client-side web app)

Build the server:
- Install Rust and Cargo
- Go to apple_server
- Run `cargo build`

Build the web app:
- Install NodeJS
- Go to apple_client
- Run `npm install`
- Run `npm run build`

## Running Locally

To run the server:
- Go to apple_server
- Run `cargo run`, this will deploy the server to http://localhost:8080 by default.

Server options:
- We use environment variables to set the Postgres database the application uses, and the port the API server is accessible on. Set these before running the application.
- Set `DATABASE_URL` to the address of the postgres server (defaults to postgresql://postgres:postgres@localhost/appleaday) 
- Set the environment variable `APPLE_PORT` to launch the server at a specific port, defaults to 8080
- Run `cargo run` which will deploy the API server to http://localhost:8080/swagger-ui (or any alternative port you provide)

To run the client:
- Go to apple_client
- Edit src/config.json to the location of the API server, should use the defaults above (localhost:8080)
- Install npm dependencies (`npm install`)
- Run the client web app (`npm run dev`)
- The React app will deploy to http://localhost:5173 by default.

## Tech Stack

- **Frontend**: React.js for the client-side application
- **Backend**: Rust Axum for the server-side application
- **Database**: PostgreSQL for data storage

## Documentation

Individual applications have code documented in README.md files under their respective folders.

## Contributing

The respective projects have CONTRIBUTING.md files that outline how to contribute to each part of the application. Please refer to those files for specific guidelines on understanding the codebase, submitting issues, and making pull requests.


