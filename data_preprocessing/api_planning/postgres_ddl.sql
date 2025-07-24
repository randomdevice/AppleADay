CREATE DATABASE appleaday;

-- Dimension Tables
DROP TABLE IF EXISTS Population;
CREATE TABLE Population (
                            Year INT NOT NULL,
                            State VARCHAR(255) NOT NULL,
                            StateCode VARCHAR(2) NOT NULL,
                            PRIMARY KEY (Year, State, StateCode)
);

DROP TABLE IF EXISTS ChronicDisease;
CREATE TABLE ChronicDisease (
                                Id INT NOT NULL,
                                Type VARCHAR(255) NOT NULL,
                                SubType VARCHAR(255),
                                PRIMARY KEY (Id)
);

DROP TABLE IF EXISTS Habit;
CREATE TABLE Habit (
                       Id INT NOT NULL,
                       Type VARCHAR(255) NOT NULL,
                       Level VARCHAR(255),
                       PRIMARY KEY (Id)
);

-- Fact Tables
DROP TABLE IF EXISTS AgeAdjustedHealthPopulation;
CREATE TABLE AgeAdjustedHealthPopulation (
                                             Year INT NOT NULL,
                                             StateCode VARCHAR(2) NOT NULL,
                                             State VARCHAR(255) NOT NULL,
                                             Age VARCHAR(255) NOT NULL,
                                             Percentage DECIMAL(5,2),
                                             Sample_Size INT,
                                             Habit INT NOT NULL,
                                             PRIMARY KEY (Year, State, StateCode, Age, Habit),
                                             FOREIGN KEY (Year, State, StateCode) REFERENCES Population(Year, State, StateCode),
                                             FOREIGN KEY (Habit) REFERENCES Habit(Id)
);

DROP TABLE IF EXISTS AgeAdjustedDiseasePopulation;
CREATE TABLE AgeAdjustedDiseasePopulation (
                                              Year INT NOT NULL,
                                              StateCode VARCHAR(2) NOT NULL,
                                              State VARCHAR(255) NOT NULL,
                                              Percentage DECIMAL(5,2),
                                              Age VARCHAR(255) NOT NULL,
                                              Disease INT NOT NULL,
                                              PRIMARY KEY (Year, State, StateCode, Age, Disease),
                                              FOREIGN KEY (Year, State, StateCode) REFERENCES Population(Year, State, StateCode),
                                              FOREIGN KEY (Disease) REFERENCES ChronicDisease(Id)
);

DROP TABLE IF EXISTS GenderAdjustedHealthPopulation;
CREATE TABLE GenderAdjustedHealthPopulation (
                                                Year INT NOT NULL,
                                                StateCode VARCHAR(2) NOT NULL,
                                                State VARCHAR(255) NOT NULL,
                                                Sex VARCHAR(255) NOT NULL,
                                                Percentage DECIMAL(5,2),
                                                Sample_Size INT,
                                                Habit INT NOT NULL,
                                                PRIMARY KEY (Year, State, StateCode, Sex, Habit),
                                                FOREIGN KEY (Year, State, StateCode) REFERENCES Population(Year, State, StateCode),
                                                FOREIGN KEY (Habit) REFERENCES Habit(Id)
);

DROP TABLE IF EXISTS GenderAdjustedDiseasePopulation;
CREATE TABLE GenderAdjustedDiseasePopulation (
                                                 Year INT NOT NULL,
                                                 StateCode VARCHAR(2) NOT NULL,
                                                 State VARCHAR(255) NOT NULL,
                                                 Percentage DECIMAL(5,2),
                                                 Sex VARCHAR(255) NOT NULL,
                                                 Disease INT NOT NULL,
                                                 PRIMARY KEY (Year, State, StateCode, Sex, Disease),
                                                 FOREIGN KEY (Year, State, StateCode) REFERENCES Population(Year, State, StateCode),
                                                 FOREIGN KEY (Disease) REFERENCES ChronicDisease(Id)
);

DROP TABLE IF EXISTS EthnicityAdjustedHealthPopulation;
CREATE TABLE EthnicityAdjustedHealthPopulation (
                                                   Year INT NOT NULL,
                                                   StateCode VARCHAR(2) NOT NULL,
                                                   State VARCHAR(255) NOT NULL,
                                                   Ethnicity VARCHAR(255) NOT NULL,
                                                   Percentage DECIMAL(5,2),
                                                   Sample_Size INT,
                                                   Habit INT NOT NULL,
                                                   PRIMARY KEY (Year, State, StateCode, Ethnicity, Habit),
                                                   FOREIGN KEY (Year, State, StateCode) REFERENCES Population(Year, State, StateCode),
                                                   FOREIGN KEY (Habit) REFERENCES Habit(Id)
);

DROP TABLE IF EXISTS EthnicityAdjustedDiseasePopulation;
CREATE TABLE EthnicityAdjustedDiseasePopulation (
                                                    Year INT NOT NULL,
                                                    StateCode VARCHAR(2) NOT NULL,
                                                    State VARCHAR(255) NOT NULL,
                                                    Percentage DECIMAL(5,2),
                                                    Ethnicity VARCHAR(255) NOT NULL,
                                                    Disease INT NOT NULL,
                                                    PRIMARY KEY (Year, State, StateCode, Ethnicity, Disease),
                                                    FOREIGN KEY (Year, State, StateCode) REFERENCES Population(Year, State, StateCode),
                                                    FOREIGN KEY (Disease) REFERENCES ChronicDisease(Id)
);