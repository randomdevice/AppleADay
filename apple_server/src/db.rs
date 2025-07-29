use axum::response::Json;
use serde_json::{json, Value, Map};
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

pub async fn list_habits<'a, E>(executor: E) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{
    let rows = sqlx::query(
        "SELECT DISTINCT * FROM habit ORDER BY id"
    )
    .fetch_all(executor)
    .await?;

	let results: Vec<Value> = rows.iter().map(|row| {
		let habit_type: String = row.try_get("type").unwrap_or_default();
		let habit_level: String = row.try_get("level").unwrap_or_default();
		json!({
			"type": habit_type,
			"level": habit_level 
		})
	}).collect();

    Ok(Json(json!(results)))
}

pub async fn list_disease<'a, E>(executor: E) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{
    let rows = sqlx::query(
        "SELECT DISTINCT * FROM chronicdisease ORDER BY id"
    )
    .fetch_all(executor)
    .await?;

	let results: Vec<Value> = rows.iter().map(|row| {
		let disease_type: String = row.try_get("type").unwrap_or_default();
		let disease_subtype: String = row.try_get("subtype").unwrap_or_default();
		json!({
			"type": disease_type,
			"level": disease_subtype 
		})
	}).collect();

    Ok(Json(json!(results)))
}

pub async fn list_health_demographics<'a, E>(executor: E) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{
    let rows = sqlx::query_scalar::<_, String>(
            "SELECT DISTINCT Ethnicity FROM ethnicityadjustedhealthpopulation"
        ).fetch_all(executor)
        .await?;

    Ok(Json(json!(rows)))
}

pub async fn list_disease_demographics<'a, E>(executor: E) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{
    let rows = sqlx::query_scalar::<_, String>(
            "SELECT DISTINCT Ethnicity FROM ethnicityadjusteddiseasepopulation"
        ).fetch_all(executor)
        .await?;

    Ok(Json(json!(rows)))
}

pub async fn list_health_age<'a, E>(executor: E) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{
    let rows = sqlx::query_scalar::<_, String>(
            "SELECT DISTINCT Age FROM AgeAdjustedHealthPopulation"
        ).fetch_all(executor)
        .await?;

    Ok(Json(json!(rows)))
}

pub async fn list_disease_age<'a, E>(executor: E) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{
    let rows = sqlx::query_scalar::<_, String>(
            "SELECT DISTINCT Age FROM AgeAdjustedDiseasePopulation"
        ).fetch_all(executor)
        .await?;

    Ok(Json(json!(rows)))
}

pub async fn list_genders<'a, E>(executor: E) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{
    let rows = sqlx::query_scalar::<_, String>(
            "SELECT DISTINCT Sex FROM genderadjustedhealthpopulation"
        ).fetch_all(executor)
        .await?;

    Ok(Json(json!(rows)))
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
		//let statecode: String = row.try_get("statecode").unwrap_or_default();
		let overallpercentage: f64 = row.try_get("overallpercentage").unwrap_or_default();
		json!({
			"state": state,
			"overallpercentage": overallpercentage 
		})
	}).collect();

    let mut result_map = Map::new();
    for dict in results {
        if let Value::Object(obj) = dict {
            if let (Some(Value::String(state)), Some(percentage)) = (obj.get("state"), obj.get("overallpercentage"))
            {
                result_map.insert(state.clone(), percentage.clone());
            }
        }
    }

    Ok(axum::Json(Value::Object(result_map)))
}

pub async fn national_average_disease<'a, E>(
        executor: E,
        disease: Option<String> 
    ) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{

	let rows = sqlx::query(
        "
        SELECT
            AVG(Percentage) as nationalAverage
        FROM
            GenderAdjustedDiseasePopulation a JOIN ChronicDisease d ON a.disease = d.id
        WHERE
            SubType = $1 AND
            Year = (SELECT MAX(Year) FROM GenderAdjustedDiseasePopulation ga WHERE a.disease = ga.disease AND Percentage IS NOT NULL) AND
            Percentage IS NOT NULL;
        "
        )
        .bind(disease.unwrap_or("Diabetes".to_string())) 
        .fetch_all(executor)
        .await?; 

     let result: Vec<Value> = rows.iter().map(|row| {
        let nationalaverage: f64 = row.try_get("nationalaverage").unwrap_or_default();
        json!({ "nationalaverage": nationalaverage })
     }).collect();

    Ok(axum::Json(json!(result[0])))
}

pub async fn national_average_health_metric<'a, E>(
        executor: E,
        level: Option<String> 
    ) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{

	let rows = sqlx::query(
        "
        SELECT
            SUM(Percentage * sample_size) / SUM(sample_size) as nationalAverage
        FROM
            ethnicityadjustedhealthpopulation a JOIN Habit h ON a.habit = h.id
        WHERE
            Level = $1 AND
            Year = (SELECT MAX(Year) FROM EthnicityAdjustedHealthPopulation) AND
            Percentage IS NOT NULL;
        "
        )
        .bind(level.unwrap_or("Obese".to_string())) 
        .fetch_all(executor)
        .await?; 

     let result: Vec<Value> = rows.iter().map(|row| {
        let nationalaverage: f64 = row.try_get("nationalaverage").unwrap_or_default();
        json!({ "nationalaverage": nationalaverage })
     }).collect();

    Ok(axum::Json(json!(result[0])))
}

pub async fn top_state_health_metric<'a, E>(
        executor: E,
        level: Option<String> 
    ) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{

	let rows = sqlx::query(
        "
        SELECT
            State,
            Year,
            Percentage AS TotalPercentage
        FROM
            AgeAdjustedHealthPopulation a JOIN Habit h ON a.habit = h.id
        WHERE
            Level = $1 AND
            Year = (SELECT MAX(Year) FROM AgeAdjustedHealthPopulation) AND
            Percentage IS NOT NULL
        ORDER BY
            Percentage DESC
        LIMIT 1;
        "
        )
        .bind(level.unwrap_or("Obese".to_string())) 
        .fetch_all(executor)
        .await?; 

     let result: Vec<Value> = rows.iter().map(|row| {
        let state: String = row.try_get("state").unwrap_or_default();
        let year: i32 = row.try_get("year").unwrap_or_default();
        let totalpercentage: f64 = row.try_get("totalpercentage").unwrap_or_default();
        json!({ "state": state, "year": year, "totalpercentage": totalpercentage })
     }).collect();

    Ok(axum::Json(json!(result[0])))
}

pub async fn top_state_disease<'a, E>(
        executor: E,
        level: Option<String> 
    ) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{

	let rows = sqlx::query(
        "
        SELECT
            State,
            Year,
            SUM(Percentage) AS TotalPercentage
        FROM
            GenderAdjustedDiseasePopulation a JOIN chronicdisease d ON a.disease = d.id
        WHERE
            d.SubType = $1 AND
            Year = (SELECT MAX(Year) FROM GenderAdjustedDiseasePopulation ga WHERE a.disease = ga.disease AND Percentage IS NOT NULL) AND
            Percentage IS NOT NULL
        GROUP BY State, Year
        ORDER BY
            TotalPercentage DESC
        LIMIT 1;"
        )
        .bind(level.unwrap_or("Asthma".to_string())) 
        .fetch_all(executor)
        .await?; 

     let result: Vec<Value> = rows.iter().map(|row| {
        let state: String = row.try_get("state").unwrap_or_default();
        let year: i32 = row.try_get("year").unwrap_or_default();
        let percentage: f64 = row.try_get("percentage").unwrap_or_default();
        json!({ "state": state, "year": year, "percentage": percentage })
     }).collect();

    Ok(axum::Json(json!(result[0])))
}


pub async fn disease_trend_over_time<'a, E>(
        executor: E,
        disease: Option<String> 
    ) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{

	let rows = sqlx::query(
        "
        SELECT
            Year,
            AVG(Percentage) as nationalAverage
        FROM
            ethnicityadjusteddiseasepopulation a JOIN ChronicDisease d ON a.disease = d.id
        WHERE
            SubType = $1
        GROUP BY
            Year
        ORDER BY
            Year ASC;
        "
        )
        .bind(disease.unwrap_or("Asthma".to_string())) 
        .fetch_all(executor)
        .await?; 

     let result: Vec<Value> = rows.iter().map(|row| {
        let year: i32 = row.try_get("year").unwrap_or_default();
        let nationalaverage: f64 = row.try_get("nationalaverage").unwrap_or_default();
        json!({ "year": year, "nationalaverage": nationalaverage })
     }).collect();

    Ok(axum::Json(json!(result)))
}

pub async fn health_trend_over_time<'a, E>(
        executor: E,
        level: Option<String> 
    ) -> Result<Json<Value>, sqlx::Error>
where
    E: Executor<'a, Database = sqlx::Postgres>,
{

	let rows = sqlx::query(
        "
        SELECT
            Year,
            AVG(Percentage) as nationalAverage
        FROM
            ethnicityadjustedhealthpopulation e JOIN Habit d ON e.habit = d.id
        WHERE
            Level = $1
        GROUP BY
            Year
        ORDER BY
            Year ASC;
        "
        )
        .bind(level.unwrap_or("Obese".to_string())) 
        .fetch_all(executor)
        .await?; 

     let result: Vec<Value> = rows.iter().map(|row| {
        let year: i32 = row.try_get("year").unwrap_or_default();
        let nationalaverage: f64 = row.try_get("nationalaverage").unwrap_or_default();
        json!({ "year": year, "nationalaverage": nationalaverage })
     }).collect();

    Ok(axum::Json(json!(result)))
}
