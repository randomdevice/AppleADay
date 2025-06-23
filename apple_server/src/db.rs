use axum::response::Json;
use serde_json::{json, Value};
use sqlx::Executor;

// generic SQL executor, used by a concrete handler `list_tables_handler`
pub async fn list_tables<'a, E>(executor: E) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{
    let rows = sqlx::query_scalar::<_, String>(
        "SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public';"
    )
    .fetch_all(executor)
    .await?;
    Ok(Json(json!({ "rows": rows })))
}

