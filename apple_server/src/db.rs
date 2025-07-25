use axum::response::Json;
use serde_json::{json, Value};
use sqlx::{Executor, Row};

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

pub async fn health_metric<'a, E>(
        executor: E,
        level: Option<String> 
    ) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{

	let rows = sqlx::query(
       		 "SELECT
       		     State,
       		     StateCode,
       		     SUM((Percentage * Sample_Size)) / SUM(Sample_Size) as OverallPercentage
       		 FROM AgeAdjustedHealthPopulation a JOIN Habit h ON a.habit = h.id
       		 WHERE
       		     Level = $1 AND
       		     Year = (SELECT MAX(Year) FROM AgeAdjustedHealthPopulation) AND 
       		     Percentage IS NOT NULL
       		 GROUP BY State, StateCode"
        )
        .bind(level.unwrap_or("Obese".to_string())) 
        .fetch_all(executor)
        .await?; 

	let results: Vec<Value> = rows.iter().map(|row| {
		let state: String = row.try_get("state").unwrap_or_default();
		let statecode: String = row.try_get("statecode").unwrap_or_default();
		let overallpercentage: f64 = row.try_get("overallpercentage").unwrap_or_default();
		json!({
			"state": state,
			"statecode": statecode,
			"overallpercentage": overallpercentage 
		})
	}).collect();

    Ok(axum::Json(json!(results)))
}
