
use std::collections::HashMap;
use std::sync::atomic::AtomicU8;
use std::sync::{Arc, Condvar, Mutex};

use thiserror::Error;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_with::{serde_as, skip_serializing_none};
use specta::Type;


pub type Result<T> = std::result::Result<T, ApiError>;
#[derive(Type, Serialize, Deserialize, Error, Debug)]
pub enum ApiError {
    #[error("Api error: {0}")]
    Error(String),

    #[error("Tauri error: {0}")]
    TauriError(String),

    #[error("reqwest error: {0}")]
    ReqwestError(String),

    #[error("IO error: {0}")]
    Io(String),

    #[error("Parse error: {0}")]
    ParseError(String),

    #[error("JSON error: {0}")]
    JsonError(String),

    #[error("Glob error: {0}")]
    GlobError(String),
}

impl From<tauri::Error> for ApiError {
    fn from(e: tauri::Error) -> Self {
        ApiError::TauriError(e.to_string())
    }
}

impl From<reqwest::header::InvalidHeaderName> for ApiError {
    fn from(e: reqwest::header::InvalidHeaderName) -> Self {
        ApiError::ReqwestError(e.to_string())
    }
}

impl From<reqwest::header::InvalidHeaderValue> for ApiError {
    fn from(e: reqwest::header::InvalidHeaderValue) -> Self {
        ApiError::ReqwestError(e.to_string())
    }
}
impl From<reqwest::Error> for ApiError {
    fn from(e: reqwest::Error) -> Self {
        ApiError::ReqwestError(e.to_string())
    }
}

impl From<std::io::Error> for ApiError {
    fn from(e: std::io::Error) -> Self {
        ApiError::Io(e.to_string())
    }
}

impl From<std::num::ParseIntError> for ApiError {
    fn from(e: std::num::ParseIntError) -> Self {
        ApiError::ParseError(e.to_string())
    }
}

impl From<serde_json::error::Error> for ApiError {
    fn from(e: serde_json::error::Error) -> Self {
        ApiError::JsonError(e.to_string())
    }
}

impl From<glob::PatternError> for ApiError {
    fn from(e: glob::PatternError) -> Self {
        ApiError::GlobError(e.to_string())
    }
}

impl From<jsonpath_lib::JsonPathError> for ApiError {
    fn from(e: jsonpath_lib::JsonPathError) -> Self {
        ApiError::JsonError(e.to_string())
    }
}
