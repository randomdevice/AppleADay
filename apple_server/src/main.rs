use axum::{
    routing::{get},
    Router,
};
use sqlx::{PgPool, postgres::PgPoolOptions};
use std::result::Result;
use std::error::Error;

pub mod types;
pub mod routes;
pub mod db;

pub use routes::{
    root, 
    apple_handler, 
    list_tables_handler, 
    health_metric_handler, 
    national_average_disease_handler, 
    top_state_health_metric_handler, 
    disease_trend_over_time_handler, 
    health_trend_over_time_handler
};

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
            "postgres://postgres:postgres@localhost:5432/appleaday".to_string()
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
        // `SAMPLE ROUTE: GET /apple/{id}` goes to `apple_handler`
        //.route("/apple/{id}", get(apple_handler))
        // `GET /tables` retrieves the names of all tables in the database
        .route("/api/v1/tables", get(list_tables_handler))
        .route("/api/v1/map/health_metric", get(health_metric_handler))
        .route("/api/v1/kpi/national_average/disease", get(national_average_disease_handler))
        .route("/api/v1/kpi/top_state/health_metric", get(top_state_health_metric_handler))
        .route("/api/v1/trends/national/disease", get(disease_trend_over_time_handler))
        .route("/api/v1/trends/national/health_metric", get(health_trend_over_time_handler))
        .with_state(pool);

    // run our app with hyper, listening globally on port 3000
    let ip = "localhost:8080";
    println!("Serving application at http://{}", ip);
    let listener = tokio::net::TcpListener::bind(ip).await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}

