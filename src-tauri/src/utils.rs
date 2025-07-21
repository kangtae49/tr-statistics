use std::env;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};
// use chardetng::EncodingDetector;
// use encoding_rs::Encoding;
// use mime_guess::from_path;
use serde::{Deserialize, Serialize};
use serde_with::{serde_as, skip_serializing_none};
use specta::Type;

// use tokio::io::AsyncReadExt;
use crate::err::{ApiError, Result};

pub fn get_resource_path() -> Result<PathBuf> {
    if tauri::is_dev() {
        let current_path = env::current_dir()?;
        Ok(current_path.join("resources"))
    } else {
        let current_path = env::current_exe()?;
        let base_path = current_path
            .parent()
            .ok_or(ApiError::Error("err parent".to_string()))?;
        Ok(base_path.join("resources"))
    }
}

#[skip_serializing_none]
#[serde_as]
#[derive(Type, Serialize, Deserialize, Clone, Debug, Default)]
pub struct TextContent {
    pub path: String,
    pub sz: u64,
    pub mimetype: String,
    pub enc: Option<String>,
    pub text: Option<String>,
}

pub fn now_sec() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}

// pub fn now_ms() -> u128 {
//     SystemTime::now()
//         .duration_since(UNIX_EPOCH)
//         .unwrap()
//         .as_millis()
// }

/*
pub async fn read_txt_infer<P: AsRef<Path>>(path: P)-> Result<TextContent> {
    let sz = path.as_ref().metadata()?.len();

    let mut file = tokio::fs::File::open(&path).await?;
    let mut reader = tokio::io::BufReader::new(file);

    let mut sample = vec![0u8; 16 * 1024];
    // let mut sample = vec![0u8; sz as usize];
    let n = reader.read(&mut sample).await?;
    sample.truncate(n);

    let mime_type = match infer::get(&sample) {
        Some(infer_type) => infer_type.mime_type().to_string(),
        None => from_path(&path).first_or_octet_stream().to_string()
    };

    println!("mime_type: {}", mime_type);

    file = tokio::fs::File::open(&path).await?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).await?;

    let mut detector = EncodingDetector::new();
    detector.feed(&buffer, true);
    let encoding: &Encoding = detector.guess(None, true);

    let (text, _, had_errors) = encoding.decode(&buffer);
    let opt_text = if had_errors {
        None
    } else {
        Some(text.into_owned())
    };

    Ok(TextContent {
        path: path.as_ref().to_string_lossy().to_string(),
        sz,
        mimetype: mime_type,
        enc: Some(encoding.name().to_string()),
        text: opt_text,
    })

}

 */
