use std::path::{absolute, Path};
// use chardetng::EncodingDetector;
// use encoding::{DecoderTrap, EncodingRef};
// use encoding_rs::Encoding;
// use tokio::io::AsyncReadExt;
use crate::err::{Result};
// use std::time::{UNIX_EPOCH};
use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use serde_with::{serde_as, skip_serializing_none};
use specta::Type;

pub fn read_utf8<P: AsRef<Path>>(path: P) -> Result<String> {
    Ok(std::fs::read_to_string(path)?)
}

#[skip_serializing_none]
#[serde_as]
#[derive(Type, Serialize, Deserialize, Clone, Debug)]
pub struct FileInfo {
    pub path: String,
    pub exists: bool,
    pub is_dir: Option<bool>,
    pub modified: Option<i64>,
    pub sz: Option<u64>,
}
pub fn read_meta<P: AsRef<Path>>(path: P) -> Result<FileInfo> {
    let abs = absolute(path.as_ref())?.to_string_lossy().to_string();
    if path.as_ref().exists() {
        let meta = path.as_ref().metadata()?;
        let modified = meta.modified()?;
        let datetime: DateTime<Local> = modified.into();

        let sec = datetime.timestamp();
        let sz = meta.len();
        Ok(FileInfo {
            path: abs,
            exists: true,
            is_dir: Some(meta.is_dir()),
            modified: Some(sec),
            sz: Some(sz),
        })
    } else {
        Ok(FileInfo {
            path: abs,
            exists: false,
            is_dir: None,
            modified: None,
            sz: None,
        })
    }
}
/*
pub async fn read_to_string<P: AsRef<Path>>(path: P) -> Result<String> {
    let mut file = tokio::fs::File::open(&path).await?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).await?;

    let mut detector = EncodingDetector::new();
    detector.feed(&buffer, true);
    let encoding: &Encoding = detector.guess(None, true);
    let (text, _, had_errors) = encoding.decode(&buffer);
    if had_errors {
        return Err(ApiError::Error(format!("decode err: {:?}", &path.as_ref())))
    }
    Ok(text.into())
}

pub fn decode(bytes: &[u8], encoding_ref: EncodingRef) -> Result<String> {
    match encoding_ref.decode(bytes, DecoderTrap::Replace) {
        Ok(txt) => Ok(txt),
        Err(_err_txt) => {
            Err(ApiError::Error("decode err".to_string()))
        }
    }
}

 */
