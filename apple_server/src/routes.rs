use axum::{
   http::StatusCode,
   extract::Path,
   extract::State,
   response::Json,
};
use sqlx::PgPool;
use serde_json::{json, Value};

use super::types::{CreateUser, User};
use super::db::list_tables;

// basic handler that responds with a static string
pub async fn root() -> &'static str {
    "Hello, World!"
}

pub async fn create_user_handler(
    // this argument tells axum to parse the request body
    // as JSON into a `CreateUser` type
    Json(payload): Json<CreateUser>,
) -> (StatusCode, Json<User>) {
    // insert your application logic here
    let user = User {
        id: 1337,
        username: payload.username,
    };

    // this will be converted into a JSON response
    // with a status code of `201 Created`
    (StatusCode::CREATED, Json(user))
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

