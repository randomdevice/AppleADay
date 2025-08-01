use sqlx::{PgPool, postgres::PgPoolOptions};
use std::result::Result;
use std::error::Error;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use utoipa_swagger_ui::SwaggerUi;

pub mod types;
pub mod routes;
pub mod db;

pub use routes::{
    root, 
    apple_handler, 
    list_tables_handler, 
    list_habits_handler, 
    list_disease_handler,
    list_health_demographics_handler,
    list_disease_demographics_handler,
    list_health_age_handler,
    list_disease_age_handler,
    list_genders_handler,
    health_metric_handler, 
    national_average_disease_handler, 
    national_average_health_metric_handler,
    top_state_disease_handler,
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
            eprintln!("DATABASE_URL environment variable is not set, defaulting to localhost Postgres DB.");
            "postgres://postgres:postgres@localhost:5432/appleaday".to_string()
        }
    };

    let port = match std::env::var("APPLE_PORT") {
        Ok(port) => port,
        Err(_) => {
            eprintln!("APPLE_PORT environment variable is not set, defaulting to port 8080");
            "8080".to_string()
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
    let (router, api) = OpenApiRouter::new()
        .routes(routes!(crate::routes::root))
        .routes(routes!(crate::routes::list_tables_handler))
        .routes(routes!(crate::routes::list_habits_handler))
        .routes(routes!(crate::routes::list_disease_handler))
        .routes(routes!(crate::routes::list_health_demographics_handler))
        .routes(routes!(crate::routes::list_disease_demographics_handler))
        .routes(routes!(crate::routes::list_health_age_handler))
        .routes(routes!(crate::routes::list_disease_age_handler))
        .routes(routes!(crate::routes::list_genders_handler))
        .routes(routes!(crate::routes::health_metric_handler))
        .routes(routes!(crate::routes::national_average_disease_handler))
        .routes(routes!(crate::routes::national_average_health_metric_handler))
        .routes(routes!(crate::routes::top_state_health_metric_handler))
        .routes(routes!(crate::routes::top_state_disease_handler))
        .routes(routes!(crate::routes::disease_trend_over_time_handler))
        .routes(routes!(crate::routes::health_trend_over_time_handler))
        .with_state(pool)
        .split_for_parts();

    let router = router.merge(SwaggerUi::new("/swagger-ui").url("/api/openapi.json", api));
    let app = router.into_make_service();

    // run our app with hyper, listening globally on port 8080 (http)
    let ip = format!("0.0.0.0:{}", port);
    println!("Serving application at http://{}", ip);
    let listener = tokio::net::TcpListener::bind(ip).await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}

