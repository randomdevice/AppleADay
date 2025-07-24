# Page 3

### **1. Get Available Filter Options**

This endpoint populates all the filter dropdowns on the page, providing the lists of available diseases and demographic breakdowns.

  * **Endpoint:** `GET /api/v1/diseases/filters`

  * **Description:** Fetches all available options for filtering the chronic disease data, including disease subtypes, years, and demographic categories.

  * **Sample Response:**

    ```json
    {
      "diseases": [
        "Prostate Cancer",
        "Cervical Cancer",
        "Breast Cancer",
        "Any Cancer",
        "Colon Cancer",
        "COPD",
        "Stroke",
        "Coronary Heart Disease",
        "Diabetes",
        "Liver Disease",
        "Asthma",
        "Lung Cancer",
        "Heart Failure"
      ],
      "years": [2021, 2020, 2019],
      "demographics": {
        "age": ["18-44", "45-64", "65 or older"],
        "gender": ["Male", "Female"],
        "ethnicity": ["Hispanic", "Non-Hispanic White", "Non-Hispanic Black", "Asian", "American Indian/Alaska Native"]
      }
    }
    ```

  * **SQL Queries:**
    This endpoint would execute several `DISTINCT` queries to build the final JSON object.

    ```sql
    -- For 'diseases'
    SELECT DISTINCT SubType FROM ChronicDisease ORDER BY SubType;

    -- For 'years'
    SELECT DISTINCT Year FROM AgeAdjustedDiseasePopulation ORDER BY Year DESC;

    -- For 'demographics.age'
    SELECT DISTINCT Age FROM AgeAdjustedDiseasePopulation;

    -- For 'demographics.gender'
    SELECT DISTINCT Sex FROM GenderAdjustedDiseasePopulation;

    -- For 'demographics.ethnicity'
    SELECT DISTINCT Ethnicity FROM EthnicityAdjustedDiseasePopulation;
    ```

-----

### **2. Get Disease Data for Visualization**

This is the primary data-retrieval endpoint for the map. It dynamically fetches data based on user selections, handling one demographic dimension at a time.

  * **Endpoint:** `GET /api/v1/diseases/data`

  * **Description:** Fetches state-level chronic disease data (e.g., mortality rate) for a specific disease, allowing for filtering by year and a single demographic category.

  * **Query Parameters:**

      * `disease` (string, required): The `SubType` of the disease (e.g., `'Diabetes'`).
      * `year` (integer, optional): The year to filter by. Defaults to the latest available year if not provided.
      * `age` (string, optional): The age group to filter by.
      * `gender` (string, optional): The gender to filter by.
      * `ethnicity` (string, optional): The ethnicity to filter by.

  * **Sample Response (for `?disease=Stroke&year=2021&age=65 or older`):**

    ```json
    {
      "filters": {
        "disease": "Stroke",
        "year": 2021,
        "age": "65 or older"
      },
      "data": [
        { "state": "Alabama", "stateCode": "AL", "percentage": 0.0035 },
        { "state": "California", "stateCode": "CA", "percentage": 0.0021 },
        { "state": "Florida", "stateCode": "FL", "percentage": 0.0028 }
      ]
    }
    ```

  * **SQL Query (Dynamic):**
    The backend logic would build the SQL query based on the parameters. The `SubType` from the `ChronicDisease` table would be used to join with the appropriate `Question` or `Topic` in the fact tables.

    #### **Case 1: Filtering by `age` (or no demographic filter)**

    *Uses `AgeAdjustedDiseasePopulation` table.*

    ```sql
    -- Parameters: disease, year, age
    SELECT
        State,
        StateCode,
        Percentage
    FROM
        AgeAdjustedDiseasePopulation a
    JOIN
        ChronicDisease c ON a.Disease = c.Id -- Assuming 'Question' in fact table maps to 'SubType'
    WHERE
        SubType = ${disease}
        AND Year = ${year}
        AND Age = ${age}; -- This line is omitted if 'age' is not provided
    ```

    #### **Case 2: Filtering by `gender`**

    *Uses `GenderAdjustedDiseasePopulation` table.*

    ```sql
    -- Parameters: disease, year, gender
    SELECT
        State,
        StateCode,
        Percentage
    FROM
        GenderAdjustedDiseasePopulation g
    JOIN
        ChronicDisease c ON g.Disease = c.Id
    WHERE
        SubType = ${disease}
        AND Year = ${year}
        AND Sex = ${gender};
    ```

    #### **Case 3: Filtering by `ethnicity`**

    *Uses `EthnicityAdjustedDiseasePopulation` table.*

    ```sql
    -- Parameters: disease, year, ethnicity
    SELECT
        State,
        StateCode,
        Percentage
    FROM
        EthnicityAdjustedDiseasePopulation e
    JOIN
        ChronicDisease c ON e.Disease = c.Id
    WHERE
        SubType = ${disease}
        AND Year = ${year}
        AND Ethnicity = ${ethnicity};
    ```

-----

### **3. Get Disease Trend for a Specific State**

This endpoint provides the data for the trend line chart that appears when a user clicks a state on the map.

  * **Endpoint:** `GET /api/v1/diseases/trends/state`

  * **Description:** Fetches the historical trend of a specific disease for a single state.

  * **Query Parameters:**

      * `disease` (string, required): The `SubType` of the disease.
      * `stateCode` (string, required): The two-letter code for the state (e.g., `'CA'`).
      * `age` / `gender` / `ethnicity` (string, optional): The demographic filter currently active on the page, to ensure the trend line matches the map view.

  * **Sample Response (for `?disease=Diabetes&stateCode=TX`):**

    ```json
    {
      "disease": "Diabetes",
      "state": "Texas",
      "stateCode": "TX",
      "trend": [
        { "year": 2019, "percentage": 0.0078 },
        { "year": 2020, "percentage": 0.0081 },
        { "year": 2021, "percentage": 0.0085 }
      ]
    }
    ```

  * **SQL Query (Dynamic):**
    The query is similar to the main data endpoint but groups by `Year` for a specific state. The example below is for the age-adjusted data. The logic would adapt to use the gender or ethnicity tables if those filters were passed.

    ```sql
    -- Parameters: disease, stateCode, (optional: age)
    SELECT
        adp.Year,
        adp.Percentage
    FROM
        AgeAdjustedDiseasePopulation a
    JOIN
        ChronicDisease c ON a.Disease = c.Id
    WHERE
        c.SubType = ${disease}
        AND a.StateCode = ${stateCode}
        -- AND a.Age = ${age} -- This line is added if 'age' is provided
    ORDER BY
        a.Year ASC;
    ```
