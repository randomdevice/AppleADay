# Page 2

### **1. Get Available Filter Options**

This single endpoint efficiently populates all the dropdowns on the page in one network request. It provides the lists of available classes, questions, years, and demographic breakdowns.

  * **Endpoint:** `GET /api/v1/health_metrics/filters`

  * **Description:** Fetches all available options for filtering the health metrics data, including health categories, specific questions, years, age groups, genders, and ethnicities.

  * **Sample Response:**

    ```json
    {
      "classes": [
        "Obesity / Weight Status",
        "Physical Activity",
        "Nutrition Habit"
      ],
      "questions": [
        "Obese",
        "Overweight",
        "No Activity",
        "Cardio and Strength",
        "Limited Fruits",
        "Limited Vegetables"
      ],
      "years": [2023, 2022, 2021, 2020, 2019],
      "demographics": {
        "age": ["18-24", "25-34", "35-44", "45-54", "55-64", "65 or older"],
        "gender": ["Male", "Female"],
        "ethnicity": ["Hispanic", "Non-Hispanic White", "Non-Hispanic Black", "Asian", "American Indian/Alaska Native"]
      }
    }
    ```

  * **SQL Queries:**
    This endpoint would execute several distinct queries to build the final JSON object.

    ```sql
    -- For 'habit type'
    SELECT DISTINCT Type FROM AgeAdjustedHealthPopulation a JOIN Habit h ON a.habit = h.id;
    
    -- For 'habits'
    SELECT DISTINCT Level FROM AgeAdjustedHealthPopulation a JOIN Habit h ON a.habit = h.id;
    
    -- For 'years'
    SELECT DISTINCT Year FROM AgeAdjustedHealthPopulation ORDER BY Year DESC;
    
    -- For 'demographics.age'
    SELECT DISTINCT Age FROM AgeAdjustedHealthPopulation;
    
    -- For 'demographics.gender'
    SELECT DISTINCT Sex FROM GenderAdjustedHealthPopulation;
    
    -- For 'demographics.ethnicity'
    SELECT DISTINCT Ethnicity FROM EthnicityAdjustedHealthPopulation;
    ```

-----

### **2. Get Health Metric Data for Visualization**

This is the primary data-retrieval endpoint. It accepts a variety of query parameters to allow for dynamic filtering based on the user's selections. The API should be designed to handle one demographic dimension (age, gender, or ethnicity) at a time, as the underlying data is pre-aggregated.

  * **Endpoint:** `GET /api/v1/health_metrics/data`

  * **Description:** Fetches state-level health data for a specific metric, allowing for filtering by year and a single demographic category.

  * **Query Parameters:**

      * `question` (string, required): The specific health question (e.g., `'Obese'`, `'No Activity'`).
      * `year` (integer, optional): The year to filter by. Defaults to the latest available year if not provided.
      * `age` (string, optional): The age group to filter by.
      * `gender` (string, optional): The gender to filter by.
      * `ethnicity` (string, optional): The ethnicity to filter by.
      * *Note: The backend should enforce that only one of `age`, `gender`, or `ethnicity` can be used per request.*

  * **Sample Response (for `?question=No Activity&year=2023&gender=Female`):**

    ```json
    {
      "filters": {
        "question": "No Activity",
        "year": 2023,
        "gender": "Female"
      },
      "data": [
        { "state": "Alabama", "stateCode": "AL", "percentage": 35.1, "sampleSize": 2800 },
        { "state": "Colorado", "stateCode": "CO", "percentage": 18.2, "sampleSize": 4500 },
        { "state": "Delaware", "stateCode": "DE", "percentage": 29.5, "sampleSize": 1950 }
      ]
    }
    ```

  * **SQL Query (Dynamic):**
    The backend logic would construct the appropriate SQL query based on the provided parameters. Here are the templates for each case.

    #### **Case 1: Filtering by `age` (or no demographic filter)**

    *Uses `AgeAdjustedHealthPopulation` table.*

    ```sql
    -- Parameters: question, year, age
    SELECT
        State,
        StateCode,
        Percentage,
        Sample_Size
    FROM
        AgeAdjustedHealthPopulation a JOIN Habit h ON a.habit = h.id
    WHERE
        Type = ${question}
        AND Year = ${year}
        AND Age = ${age}; -- This line is omitted if 'age' is not provided
    ```

    #### **Case 2: Filtering by `gender`**

    *Uses `GenderAdjustedHealthPopulation` table.*

    ```sql
    -- Parameters: question, year, gender
    SELECT
        State,
        LocationAbbr as StateCode,
        Percentage,
        Sample_Size
    FROM
        GenderAdjustedHealthPopulation g JOIN Habit h ON g.habit = h.id
    WHERE
        Type = ${question}
        AND Year = ${year}
        AND Sex = ${gender};
    ```

    #### **Case 3: Filtering by `ethnicity`**

    *Uses `EthnicityAdjustedHealthPopulation` table.*

    ```sql
    -- Parameters: question, year, ethnicity
    SELECT
        State,
        LocationAbbr as StateCode,
        Percentage,
        Sample_Size
    FROM
        EthnicityAdjustedHealthPopulation e JOIN Habit h ON e.habit = h.id
    WHERE
        Type = ${question}
        AND Year = ${year}
        AND Ethnicity = ${ethnicity};
    ```
