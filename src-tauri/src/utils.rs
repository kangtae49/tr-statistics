use std::env;
use std::path::PathBuf;
use crate::err::{ApiError, Result};


pub fn get_resource_path() -> Result<PathBuf> {
    let exe_path = env::current_exe()?;
    let base_path = exe_path.parent().ok_or(ApiError::Error("err parent".to_string()))?;
    Ok(base_path.join("resources"))
}