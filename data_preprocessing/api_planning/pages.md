### **Page 1: National Health Dashboard (Home Page)**

This page serves as the main landing area, providing a high-level, at-a-glance overview of the nation's health landscape.

* **Interactive Summary Map:** A prominent map of the United States displaying a key, default metric like the overall obesity rate. States are color-coded, and hovering over them reveals the exact percentage. 
* **Key Performance Indicators (KPIs):** A series of cards at the top of the page highlighting major national statistics for the most recent year, such as:
    * National Average Diabetes Rate
    * Most Physically Active State
    * State with the Highest Fruit & Vegetable Consumption
    * Others (randomly shift between them when site is reloaded)
* **National Trend Lines:** A few simple line charts showing the trends over the last several years for critical metrics like "Heart Disease Mortality" and "Physical Inactivity."
* **Navigation:** Clear links and buttons guiding users to the more detailed exploration pages.

***

### **Page 2: Health Metrics Explorer**

This page allows users to perform a deep dive into specific health behaviors and characteristics across the country.

* **Primary Feature:** A table allowing you to filter for a specific habit (type and subtype).
* **Controls & Filters:**
    * **Metric Selection (Dropdowns):**
        1.  **Health Class:** Users first select a broad category, such as `NutritionHabit`, `ActivityHabit`, or `Weight`.
        2.  **Specific Question:** Based on the class, a second dropdown is populated with specific questions like `"Consumed fruit more than once per day"` or `"Physically Inactive"`.
    * **Demographic Filters (Dropdowns):** Users can filter the entire view by `Year`, `Age Group`, `Gender`, or `Ethnicity` to see how metrics differ across populations.
* **Visualization:**
    * The map automatically updates to show the `Percentage` for the selected metric and filters for each state.
    * A sortable data table below the map lists all states with their corresponding data, including `Percentage` and `Sample_Size`.

***

### **Page 3: Chronic Disease Explorer**

This page is dedicated to visualizing the impact and prevalence of various chronic diseases.

* **Primary Feature:** An interactive map of the US.
* **Controls & Filters:**
    * **Disease Selection (Dropdown):** A dropdown allows users to select a specific `ChronicDisease` `SubType`, such as `"Coronary Heart Disease"`, `"Stroke"`, `"Diabetes"`, or `"All Cancers"`.
    * **Demographic Filters:** Identical to the Health Metrics Explorer, allowing filtering by `Year`, `Age Group`, `Gender`, and `Ethnicity`.
* **Visualization:**
    * The map displays the `Percentage` (e.g., mortality rate or prevalence) for the selected disease in each state.
    * Clicking on a state could trigger a pop-up or a new chart showing the **trend line** for that disease in that specific state over all available years.

***

### **Page 4: Health & Disease Correlation Center**

This is the most powerful page, enabling users to explore the relationships between health behaviors and disease outcomes by **joining the datasets**.

* **Feature 1: Scatter Plot Correlator**
    * **X-Axis:** A dropdown to select any metric from the **health datasets** (e.g., `% of population that is physically inactive`).
    * **Y-Axis:** A dropdown to select any metric from the **disease datasets** (e.g., `% mortality from Diabetes`).
    * **Visualization:** The tool generates a scatter plot where each dot represents a state. This allows users to visually identify potential correlations. For instance, do states with higher rates of inactivity also have higher rates of diabetes? A "best-fit" trend line can be overlaid on the plot.
* **Feature 2: Side-by-Side Table Comparison**
    * Two US tables are displayed next to each other. 
    * The left map is controlled by the Health Metrics selectors.
    * The right map is controlled by the Disease selectors.
    * This allows for direct visual comparison of geographic patterns. For example, a user could display `"Low Fruit Consumption"` on one map and `"High Blood Pressure"` on the other to see if the hardest-hit states overlap.
* **Underlying Logic:** This page relies on `JOIN` operations between the health and disease tables on `Year` and `State` to create a unified dataset for visualization.

***

### **Page 5: State Deep Dive Profile**

This feature provides a comprehensive, printable report for any selected state.

* **Selection:** Users can select a state from a dropdown or by clicking it on any map.
* **Content:**
    * **State Dashboard:** Key metrics and rankings for the selected state (e.g., "California ranks #5 for 'Excellent' health status").
    * **Comparative Bar Charts:** For a selected metric, a chart shows the breakdown by `Gender`, `Age`, and `Ethnicity` within the state, compared against the national average for each group.
    * **Full Data Tables:** Filtered tables showing all available health and disease data over time for just that state.
