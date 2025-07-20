use std::path::Path;
// use chardetng::EncodingDetector;
// use encoding::{DecoderTrap, EncodingRef};
// use encoding_rs::Encoding;
// use tokio::io::AsyncReadExt;
use crate::err::Result;

pub fn read_utf8<P: AsRef<Path>>(path: P) -> Result<String> {
    Ok(std::fs::read_to_string(path)?)
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
