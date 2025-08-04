use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Level {
    pub level: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Disease {
    pub dtype: Option<String>,
    pub subtype: Option<String>,
    pub top: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct StateDisease {
    pub dtype: Option<String>,
    pub subtype: Option<String>,
    pub state: Option<String>,
}
