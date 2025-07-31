# AppleADay

AppleADay is a public health application that aggregates statistics on health habits and disease data between various times, demographics, and locations. 

The following project is organized into several folders:
- **apple_client**: The client-side application that users interact with.
- **apple_server**: The server-side application that handles data storage and processing.
- **data_preprocessing**: Will store .ipynb notebooks and Python scripts for preparing and cleaning database data before it is used in the application.

## General Startup

This application requires:
- a Postgres server, with the data loaded from the CSVs in data_preprocessing/preprocessed_data
- Rust and Cargo installed
- NodeJS installed

To run the server:
- Set DATABASE_URL to the address of the postgres server (like postgres://postgres:postgres:5432/appleaday)
- Set the environment variable APPLE_PORT to launch the server at a specific port, defaults to 8080
- Run `cargo run` which will deploy the API server to http://localhost:8080/swagger-ui (or any alternative port you provide)

To run the client at apple_client:
- Point src/config.json to the location of the API server, should use the defaults above (localhost:8080)
- Install npm dependencies (`npm install`)
- Run the client web app (`npm run dev`)

## Development Dependencies

This repository requires the following dependencies to be installed/setup in order to develop:

- Cargo and Rust (for the server-side application) (install: [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install))
- Node.js and npm (for the client-side application) (install: [https://nodejs.org/en/download](https://nodejs.org/en/download))
- PostgreSQL (for the database) (testing in local instance for now)

## TODO: Containerized Development Environment

The above development dependencies can be setup in a containerized environment, without requiring you to install them to your local machine.

The only dependency is having an underlying system running Docker and Docker Compose.

This repository will eventually supply a docker-compose.yaml file to allow development in a containerized environment.

VSCode and any other IDEs can be used to edit the code, but VSCode is recommended for its integrated terminal and debugging capabilities and container support.

Install Docker here: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

## Tech Stack

- **Frontend**: React.js for the client-side application
- **Backend**: Rust Axum for the server-side application
- **Database**: PostgreSQL for data storage

## Contributing

The respective projects have CONTRIBUTING.md files that outline how to contribute to each part of the application. Please refer to those files for specific guidelines on understanding the codebase, submitting issues, and making pull requests.


