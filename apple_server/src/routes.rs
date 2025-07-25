use axum::{
   http::StatusCode,
   extract::Path,
   extract::State,
   extract::Query,
   response::Json,
};
use sqlx::PgPool;
use serde_json::{json, Value};

// SQLx functions
use super::db::health_metric;
use super::db::list_tables;
use super::db::national_average_disease;
use super::db::top_state_health_metric;
use super::db::disease_trend_over_time;
use super::db::health_trend_over_time;

// Input types
use super::types::{Level, Disease};

// basic handler that responds with a static string
pub async fn root() -> &'static str {
    "Hello, World!"
}

pub async fn apple_handler(Path(id): Path<String>) -> (StatusCode, Json<Value>) {
    (StatusCode::CREATED, Json(json!({ "apple": id })))
}

pub async fn list_tables_handler(
    State(pool): State<PgPool>,
) -> (StatusCode, Json<Value>) {
    list_tables(&pool)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

pub async fn health_metric_handler(
    State(pool): State<PgPool>,
    Query(params): Query<Level>
) -> (StatusCode, Json<Value>) {
    let level = Some(params.level.unwrap_or("Obese".to_string()).trim_matches('"').to_string());
    health_metric(&pool, level)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

pub async fn national_average_disease_handler(
    State(pool): State<PgPool>,
    Query(params): Query<Disease>
) -> (StatusCode, Json<Value>) {
    let disease = Some(params.subtype.unwrap_or("Diabetes".to_string()).trim_matches('"').to_string());
    national_average_disease(&pool, disease)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

pub async fn top_state_health_metric_handler(
    State(pool): State<PgPool>,
    Query(params): Query<Level>
) -> (StatusCode, Json<Value>) {
    let level = Some(params.level.unwrap_or("Obese".to_string()).trim_matches('"').to_string());
    top_state_health_metric(&pool, level)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

pub async fn disease_trend_over_time_handler(
    State(pool): State<PgPool>,
    Query(params): Query<Disease>
) -> (StatusCode, Json<Value>) {
    let disease = Some(params.subtype.unwrap_or("Asthma".to_string()).trim_matches('"').to_string());
    disease_trend_over_time(&pool, disease)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

pub async fn health_trend_over_time_handler(
    State(pool): State<PgPool>,
    Query(params): Query<Level>
) -> (StatusCode, Json<Value>) {
    let level = Some(params.level.unwrap_or("Obese".to_string()).trim_matches('"').to_string());
    health_trend_over_time(&pool, level)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}
