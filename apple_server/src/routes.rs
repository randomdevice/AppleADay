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
use super::db::list_habits;
use super::db::list_disease;

use super::db::list_health_demographics;
use super::db::list_disease_demographics;
use super::db::list_health_age;
use super::db::list_disease_age;
use super::db::list_genders;

use super::db::national_average_disease;
use super::db::national_average_health_metric;
use super::db::top_state_disease;
use super::db::top_state_health_metric;
use super::db::disease_trend_over_time;
use super::db::health_trend_over_time;


// Input types
use super::types::{Level, Disease};

// basic handler that responds with a static string
#[utoipa::path(
    get,
    path = "/"
)]
pub async fn root() -> &'static str {
    "Hello, World!"
}

pub async fn apple_handler(Path(id): Path<String>) -> (StatusCode, Json<Value>) {
    (StatusCode::CREATED, Json(json!({ "apple": id })))
}

#[utoipa::path(
    get,
    path = "/api/v1/tables"
)]
pub async fn list_tables_handler(
    State(pool): State<PgPool>,
) -> (StatusCode, Json<Value>) {
    list_tables(&pool)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

#[utoipa::path(
    get,
    path = "/api/v1/habits",
    description = "Get list of distinct habits."
)]
pub async fn list_habits_handler(
    State(pool): State<PgPool>,
) -> (StatusCode, Json<Value>) {
    list_habits(&pool)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

#[utoipa::path(
    get,
    path = "/api/v1/diseases",
    description = "Get list of distinct diseases."
)]
pub async fn list_disease_handler(
    State(pool): State<PgPool>,
) -> (StatusCode, Json<Value>) {
    list_disease(&pool)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

#[utoipa::path(
    get,
    path = "/api/v1/diseases/age",
    description = "Get list of age ranges associated with disease tables."
)]
pub async fn list_disease_age_handler(
    State(pool): State<PgPool>,
) -> (StatusCode, Json<Value>) {
    list_disease_age(&pool)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

#[utoipa::path(
    get,
    path = "/api/v1/diseases/demographics",
    description = "Get list of demographics associated with disease tables."
)]
pub async fn list_disease_demographics_handler(
    State(pool): State<PgPool>,
) -> (StatusCode, Json<Value>) {
    list_disease_demographics(&pool)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

#[utoipa::path(
    get,
    path = "/api/v1/health_metric/demographics",
    description = "Get list of demographics associated with health_metric tables."
)]
pub async fn list_health_demographics_handler(
    State(pool): State<PgPool>,
) -> (StatusCode, Json<Value>) {
    list_health_demographics(&pool)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

#[utoipa::path(
    get,
    path = "/api/v1/health_metric/age",
    description = "Get list of age ranges associated with health_metric tables."
)]
pub async fn list_health_age_handler(
    State(pool): State<PgPool>,
) -> (StatusCode, Json<Value>) {
    list_health_age(&pool)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

#[utoipa::path(
    get,
    path = "/api/v1/genders",
    description = "Get list of genders associated with all tables."
)]
pub async fn list_genders_handler(
    State(pool): State<PgPool>,
) -> (StatusCode, Json<Value>) {
    list_genders(&pool)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

#[utoipa::path(
    get,
    path = "/api/v1/map/health_metric",
    params(
        ("level" = Option<String>, Query, description = "The habit level to query for.", example = "Obese")
    ),
    description = "Queries statewide data for the current year of the average level of a given health metric."
)]
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

#[utoipa::path(
    get,
    path = "/api/v1/kpi/national_average/disease",
    params(
        ("subtype" = Option<String>, Query, description = "The disease subtype to query for.", example = "Asthma")
    ),
    description = "Returns a KPI representing the national average of a disease subtype."
)]
pub async fn national_average_disease_handler(
    State(pool): State<PgPool>,
    Query(params): Query<Disease>
) -> (StatusCode, Json<Value>) {
    let disease = Some(params.subtype.unwrap_or("Asthma".to_string()).trim_matches('"').to_string());
    national_average_disease(&pool, disease)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

#[utoipa::path(
    get,
    path = "/api/v1/kpi/national_average/health_metric",
    params(
        ("level" = Option<String>, Query, description = "The health_metric level to query for.", example = "Obese")
    ),
    description = "Returns a KPI representing the national average of a disease subtype."
)]
pub async fn national_average_health_metric_handler(
    State(pool): State<PgPool>,
    Query(params): Query<Level>
) -> (StatusCode, Json<Value>) {
    let level = Some(params.level.unwrap_or("Obese".to_string()).trim_matches('"').to_string());
    national_average_health_metric(&pool, level)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}


#[utoipa::path(
    get,
    path = "/api/v1/kpi/top_state/health_metric",
    params(
        ("level" = Option<String>, Query, description = "The health metric level to query for.", example = "Obese")
    ),
    description = "Returns a KPI representing the top state of a health metric subtype."
)]
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

#[utoipa::path(
    get,
    path = "/api/v1/kpi/top_state/disease",
    params(
        ("subtype" = Option<String>, Query, description = "The health metric level to query for.", example = "Asthma")
    ),
    description = "Returns a KPI representing the top state of a disease subtype."
)]
pub async fn top_state_disease_handler(
    State(pool): State<PgPool>,
    Query(params): Query<Disease>
) -> (StatusCode, Json<Value>) {
    let disease = Some(params.subtype.unwrap_or("Asthma".to_string()).trim_matches('"').to_string());
    top_state_disease(&pool, disease)
        .await
        .map(|json| (StatusCode::OK, json))
        .unwrap_or_else(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({}))))
}

#[utoipa::path(
    get,
    path = "/api/v1/trends/national/disease",
    params(
        ("subtype" = Option<String>, Query, description = "The disease subtype to query for.", example = "Asthma")
    ),
    description = "Returns the disease trend for all tracked years."
)]
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

#[utoipa::path(
    get,
    path = "/api/v1/trends/national/health_metric",
    params(
        ("level" = Option<String>, Query, description = "The habit level to query for.", example = "Obese")
    ),
    description = "Returns the health trend for all tracked years."
)]
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
