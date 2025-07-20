use crate::tasks::shell_task::ShellType;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_with::serde_as;
use specta::Type;

#[serde_as]
#[derive(Type, Serialize, Deserialize, JsonSchema, Clone, Debug)]
pub enum ArgType {
    String,
}

#[serde_as]
#[derive(Type, Serialize, Deserialize, JsonSchema, Clone, Debug)]
pub struct ScriptArg {
    pub arg_type: ArgType,
    pub name: String,
    pub description: String,
    pub default: String,
}

#[serde_as]
#[derive(Type, Serialize, Deserialize, JsonSchema, Clone, Debug)]
pub struct ScriptInfo {
    pub name: String,
    pub description: String,
    pub shell_type: ShellType,
    pub script: String,
    pub args: Vec<ScriptArg>,
}

#[serde_as]
#[derive(Type, Serialize, Deserialize, JsonSchema, Clone, Debug)]
pub struct Setting {
    script_files: Vec<ScriptInfo>,
}
