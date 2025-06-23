use axum::{
    routing::{get, post},
    Router,
};

use sqlx::{PgPool, postgres::PgPoolOptions};
use std::result::Result;
use std::error::Error;

pub mod types;
pub mod routes;
pub mod db;

use routes::{root, create_user_handler, apple_handler, list_tables_handler};

async fn connect_db(database_url: &str) -> Result<PgPool, Box<dyn Error>> {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await?;
    Ok(pool)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // initialize tracing
    tracing_subscriber::fmt::init();
    
    // Establishes a database connection pool
    let database_url = match std::env::var("DATABASE_URL" ) {
        Ok(url) => url,
        Err(_) => {
            eprintln!("DATABASE_URL environment variable is not set, defaulting to localhost.");
            "postgres://postgres:postgres@localhost:5432/postgres".to_string()
        }
    };

    let pool = match connect_db(&database_url).await {
        Ok(pool) => pool,
        Err(e) => {
            eprintln!("Failed to connect to the database: {}", e);
            return Err(e);
        }
    };

    // build our application with a route
    let app = Router::new()
        // `GET /` goes to `root`
        .route("/", get(root))
        // `POST /users` goes to `create_user_handler`
        .route("/users", post(create_user_handler))
        // `GET /apple/{id}` goes to `apple_handler`
        .route("/apple/{id}", get(apple_handler))
        // `GET /tables` retrieves the names of all tables in the database
        .route("/tables", get(list_tables_handler))
        .with_state(pool);

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("localhost:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}

