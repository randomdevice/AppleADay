# Page 1

### **1. Interactive Summary Map Data**

This endpoint provides the data needed to render the main US map, showing the percentage of the population that is obese in each state for the most recent year.

  * **Endpoint:** `GET /api/v1/map/health_metric`

  * **Description:** Fetches the percentage of the population for a given health metric across all states for the latest available year.

  * **Query Parameters:**

      * `question` (string, required): The specific health question to query. For the default map, this would be `'Obese'`.

  * **Sample Response (for `?level=Obese`):**

    ```json
    {
      "year": 2023,
      "metric": "Obese",
      "data": [
        { "state": "Alabama", "stateCode": "AL", "percentage": 38.5 },
        { "state": "Alaska", "stateCode": "AK", "percentage": 30.2 },
        { "state": "Arizona", "stateCode": "AZ", "percentage": 31.4 },
        { "state": "California", "stateCode": "CA", "percentage": 28.1 }
      ]
    }
    ```

  * **SQL Query:**
    This query selects the percentage for the specified question from the `AgeAdjustedHealthPopulation` table. It filters for the most recent year in the dataset and excludes any entries with null percentages.

    ```sql
    SELECT
        State,
        StateCode,
        SUM((Percentage * Sample_Size)) / SUM(Sample_Size) as OverallPercentage
    FROM AgeAdjustedHealthPopulation a JOIN Habit h ON a.habit = h.id
    WHERE
        Level = 'Obese' AND
        Year = (SELECT MAX(Year) FROM AgeAdjustedHealthPopulation) AND 
        Percentage IS NOT NULL
    GROUP BY State, StateCode;
    ```

-----

### **2. Key Performance Indicators (KPIs)**

These endpoints deliver the high-level national statistics for the dashboard's KPI cards.

#### **KPI 1: National Average Disease Rate**

  * **Endpoint:** `GET /api/v1/kpi/national_average/disease`

  * **Description:** Calculates the national average percentage for a specific chronic disease for the latest year.

  * **Query Parameters:**

      * `disease` (string, required): The `SubType` of the disease (e.g., `'Diabetes'`).

  * **Sample Response (for `?subtype="Diabetes"`):**

    ```json
    {
      "year": 2021,
      "disease": "Diabetes",
      "nationalAverage": 0.0085
    }
    ```

  * **SQL Query:**
    This query calculates the average percentage for the given disease across all states for the most recent year in the `AgeAdjustedDiseasePopulation` table.

    ```sql
    SELECT
        AVG(Percentage) as nationalAverage
    FROM
        AgeAdjustedDiseasePopulation a JOIN ChronicDisease d ON a.disease = d.id
    WHERE
        SubType = 'Diabetes' AND
        Year = (SELECT MAX(Year) FROM AgeAdjustedDiseasePopulation);    
    ```

#### **KPI 2: Top State for a Health Metric**

  * **Endpoint:** `GET /api/v1/kpi/top_state/health_metric`

  * **Description:** Finds the state with the highest percentage for a positive health metric.

  * **Query Parameters:**

      * `question` (string, required): The health metric to evaluate (e.g., `'Cardio and Strength'`).

  * **Sample Response (for `?level="Cardio and Strength"`):**

    ```json
    {
      "year": 2023,
      "metric": "Cardio and Strength",
      "state": "Colorado",
      "percentage": 35.2
    }
    ```

  * **SQL Query:**
    This query finds the state with the highest percentage for the specified health question in the most recent year.

    ```sql
    SELECT
        State,
        Percentage
    FROM
        AgeAdjustedHealthPopulation a JOIN Habit h ON a.habit = h.id
    WHERE
        Level = 'Cardio and Strength' AND
        Year = (SELECT MAX(Year) FROM AgeAdjustedHealthPopulation) AND
        Percentage IS NOT NULL
    ORDER BY
        Percentage DESC
    LIMIT 1;
    ```

-----

### **3. National Trend Lines**

These endpoints provide data to draw the line charts showing national trends over time.

#### **Trend 1: Disease Trend Over Time**

  * **Endpoint:** `GET /api/v1/trends/national/disease`

  * **Description:** Fetches the national average for a specific disease for every year available in the dataset.

  * **Query Parameters:**

      * `disease` (string, required): The `SubType` of the disease (e.g., `'Coronary Heart Disease'`).

  * **Sample Response (for `?subtype="Coronary Heart Disease"`):**

    ```json
    {
      "disease": "Coronary Heart Disease",
      "trend": [
        { "year": 2019, "nationalAverage": 0.0062 },
        { "year": 2020, "nationalAverage": 0.0065 },
        { "year": 2021, "nationalAverage": 0.0068 }
      ]
    }
    ```

  * **SQL Query:**
    This query groups the data by year and calculates the average national percentage for the specified disease for each year.

    ```sql
    SELECT
        Year,
        AVG(Percentage) as nationalAverage
    FROM
        AgeAdjustedDiseasePopulation a JOIN ChronicDisease d ON a.disease = d.id
    WHERE
        SubType = 'Coronary Heart Disease'
    GROUP BY
        Year
    ORDER BY
        Year ASC;    
    ```

#### **Trend 2: Health Metric Trend Over Time**

  * **Endpoint:** `GET /api/v1/trends/national/health_metric`

  * **Description:** Fetches the national average for a specific health metric for every year.

  * **Query Parameters:**

      * `question` (string, required): The health metric to track (e.g., `'No Activity'`).

  * **Sample Response (for `?level="No Activity"`):**

    ```json
    {
      "metric": "No Activity",
      "trend": [
        { "year": 2021, "nationalAverage": 25.1 },
        { "year": 2022, "nationalAverage": 25.8 },
        { "year": 2023, "nationalAverage": 26.2 }
      ]
    }
    ```

  * **SQL Query:**
    This query groups the data by year and calculates the average national percentage for the specified health question for each year.

    ```sql
    SELECT
        Year,
        AVG(Percentage) as nationalAverage
    FROM
        AgeAdjustedHealthPopulation a JOIN Habit h ON a.habit = h.id
    WHERE
        Level = 'No Activity'
    GROUP BY
        Year
    ORDER BY
        Year ASC;    
    ```
