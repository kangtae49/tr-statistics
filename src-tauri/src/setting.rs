use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_with::serde_as;
use specta::Type;

#[serde_as]
#[derive(Type, Serialize, Deserialize, JsonSchema, Clone, Debug)]
pub struct Setting {
    script_files: Vec<String>
}
