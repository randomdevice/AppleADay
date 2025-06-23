# AppleADay

AppleADay is a public health application that aggregates statistics on health habits and disease data between various times, demographics, and locations. 

The following project is organized into several folders:
- **apple_client**: The client-side application that users interact with.
- **apple_server**: The server-side application that handles data storage and processing.
- **data_preprocessing**: Will store .ipynb notebooks and Python scripts for preparing and cleaning database data before it is used in the application.

## Dependencies

This repository requires the following dependencies to be installed:
- Python 3.8 or higher
- Cargo (for Rust components)
- Node.js (for the client-side application)
- npm (for managing JavaScript packages)
- PostgreSQL (for the database)

## Development Environment

This repository will eventually supply a docker-compose.yaml file to run the application in a containerized development environment, which will include all necessary dependencies.

The only dependency is having a system running Docker and Docker Compose.

VSCode and any other IDEs can be used to edit the code, but VSCode is recommended for its integrated terminal and debugging capabilities.

## Tech Stack

- **Frontend**: React.js for the client-side application.
- **Backend**: Rust Axum for the server-side application
- **Database**: PostgreSQL for data storage.

## Contributing

The respective projects have CONTRIBUTING.md files that outline how to contribute to each part of the application. Please refer to those files for specific guidelines on understanding the codebase, submitting issues, and making pull requests.

