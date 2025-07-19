use std::env;
use std::path::{absolute, Path};
use std::process::Stdio;
use std::sync::Arc;

use tokio::sync::RwLock;
use tokio::task::JoinHandle;
use tokio::process::Command;
use tokio::io::{AsyncBufReadExt, AsyncRead, BufReader as AsyncBufReader};
use encoding::{DecoderTrap, EncodingRef};
use encoding::label::encoding_from_whatwg_label;
use serde::{Deserialize, Serialize};
use serde_with::{serde_as, skip_serializing_none};
use specta::Type;
use tauri::{Emitter, State};

use crate::err::{Result, ApiError};
use crate::app_state::AppState;

#[skip_serializing_none]
#[serde_as]
#[derive(Type, Serialize, Deserialize, Clone, Debug)]
pub struct TaskNotify {
    pub task_id: String,
    pub task_status: TaskStatus,
    pub exit_code: Option<i32>,
    pub message: String,
}

#[skip_serializing_none]
#[serde_as]
#[derive(Type, Serialize, Deserialize, Clone, Debug)]
pub enum TaskStatus {
    Begin,
    Running,
    End,
    Stdout,
    Stderr,
}

#[skip_serializing_none]
#[serde_as]
#[derive(Type, Serialize, Deserialize, Clone, Debug)]
pub enum ShellType {
    Cmd,
    Powershell,
    Python,
}

#[skip_serializing_none]
#[serde_as]
#[derive(Type, Serialize, Deserialize, Clone, Debug)]
pub struct ShellJob {
    pub task_id: String,
    pub shell_type: ShellType,
    pub args: Vec<String>,
    pub shell: Option<String>,
    pub working_dir: Option<String>,
    pub encoding: Option<String>,
}

impl ShellJob {
    pub fn make_task(&self) -> Result<ShellTask> {
        let job = self.clone();
        let exe_path = env::current_exe()?;
        let base_path = exe_path.parent().ok_or(ApiError::Error("err parent".to_string()))?;
        let shell = match &job.shell_type {
            ShellType::Python => {
                let python_path = base_path.join("resources/src-python/.venv/Scripts/python.exe");
                let python_abs = absolute(python_path)?;

                match &job.shell {
                    Some(s) => s.clone(),
                    None => python_abs.to_string_lossy().to_string(),
                }
            }
            ShellType::Cmd => {
                match &job.shell {
                    Some(s) => s.clone(),
                    None => "cmd".to_string(),
                }
            }
            ShellType::Powershell => {
                match &job.shell {
                    Some(s) => s.clone(),
                    None => "powershell".to_string(),
                }
            }
        };

        let working_dir = match &job.working_dir {
            Some(s) => s.clone(),
            None => {
                let working_path = base_path.join("resources/src-python");
                working_path.to_string_lossy().to_string()
            },
        };

        let encoding = match &job.encoding {
            Some(s) => s.clone(),
            None => "windows_949".to_string(),
        };

        Ok(ShellTask {
            task_id: job.task_id.clone(),
            shell_type: job.shell_type.clone(),
            shell,
            args: job.args.clone(),
            working_dir,
            encoding,
        })

    }
}

#[derive(Clone, Debug)]
pub struct ShellTask {
    pub task_id: String,
    pub shell_type: ShellType,
    pub shell: String,
    pub args: Vec<String>,
    pub working_dir: String,
    pub encoding: String,
}

pub const EVENT_NAME: &str = "shell_task";

impl ShellTask {
    pub async fn run(&self, state: State<'_, AppState>, window: tauri::Window) -> Result<Option<i32>>  {
        println!("run: {:?}", &self);

        let folder = self.working_dir.clone();
        let p_folder = Path::new(&folder);
        if !p_folder.exists() {
            std::fs::create_dir_all(Path::new(&folder))?;
        }

        let child = Command::new(self.shell.clone())
            .args(self.args.clone())
            .current_dir(self.working_dir.clone())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()?;
        let child_arc = Arc::new(RwLock::new(child));

        let shell_handles = Arc::clone(&state.shell_handles);
        shell_handles.write().await
            .insert(self.task_id.clone(), child_arc.clone());

        window.emit(EVENT_NAME, TaskNotify {
            task_id: self.task_id.clone(),
            task_status: TaskStatus::Running,
            exit_code: None,
            message: "".to_string(),
        })?;
        let mut child = child_arc.write().await;
        let (stdout, stderr) = {
            let stdout = child.stdout
                .take()
                .ok_or_else(|| ApiError::Error("Failed to capture stdout".into()))?;
            let stderr = child.stderr
                .take()
                .ok_or_else(|| ApiError::Error("Failed to capture stderr".into()))?;
            (stdout, stderr)
        };
        drop(child);

        let encoding_ref = encoding_from_whatwg_label(&self.encoding)
            .unwrap_or(encoding::all::UTF_8);
        let stdout_task = get_stdout(stdout, TaskStatus::Stdout, self.task_id.clone(), window.clone(), encoding_ref);
        let stderr_task = get_stdout(stderr, TaskStatus::Stderr, self.task_id.clone(), window.clone(), encoding_ref);
        let _ = tokio::join!(stdout_task, stderr_task);
        let status = {
            let mut child = child_arc.write().await;
            child.wait().await?
        };
        Ok(status.code())
    }

}

pub async fn stop(state: State<'_, AppState>, task_id: String) -> Result<()>  {
    println!("stop before: {:?}", &task_id);
    if let Some(child_arc) = state.shell_handles.write().await.remove(&task_id) {
        let mut child = child_arc.write().await;
        child.kill().await?;
    } else {
        println!("shell task {} not found", task_id);
    }
    println!("stop after: {:?}", &task_id);
    Ok(())
}

fn get_stdout<T: AsyncRead + Unpin + Send + 'static>(out: T, task_status: TaskStatus, task_id: String, window: tauri::Window, encoding_ref: EncodingRef) -> JoinHandle<()> {
    tokio::spawn(async move {
        let mut reader = AsyncBufReader::new(out).lines();
        while let Ok(Some(line)) = reader.next_line().await {
            let decoded = encoding_ref
                .decode(line.as_bytes(), DecoderTrap::Replace)
                .unwrap_or_else(|_| "<decoding error>".to_string());
            println!("{:?}", decoded.clone());
            if let Err(e) = window.emit(EVENT_NAME, TaskNotify {
                task_id: task_id.clone(),
                task_status: task_status.clone(),
                exit_code: None,
                message: decoded.clone(),
            }) {
                println!("{:?}", e);
            };
        }
        println!("done: {:?}", task_status);
    })
}