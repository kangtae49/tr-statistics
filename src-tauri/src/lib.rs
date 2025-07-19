mod err;
mod menu;
mod app_state;
mod setting;
mod utils;

mod tasks {
    pub mod shell_task;
}

use std::collections::HashMap;
use std::sync::Arc;
use tauri::{Emitter, State};
use tauri_specta::{collect_commands, Builder};
use tokio::sync::RwLock;
use crate::app_state::AppState;
use crate::menu::create_menu;
use crate::err::Result;
use crate::tasks::shell_task::{stop, ShellJob, TaskNotify, TaskStatus};
use crate::setting::{Setting};
use crate::utils::{get_resource_path, read_txt_infer};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
#[specta::specta]
async fn get_setting() -> Result<Setting> {
    let resource_path = get_resource_path()?;
    let json_str = match read_txt_infer(resource_path.join("setting.json")).await {
        Ok(text_content) => {
            match text_content.text {
                Some(text) => { text }
                None => { "".to_string() }
            }
        }
        Err(e) => {
            println!("{:?}", e);
            "".to_string()
        }
    };
    let setting = serde_json::from_str::<Setting>(&json_str)?;
    Ok(setting)
}

#[tauri::command]
#[specta::specta]
async fn run_shell(state: State<'_, AppState>, window: tauri::Window, shell_job: ShellJob) -> Result<()> {
    let shell_task = shell_job.make_task()?;
    window.emit(tasks::shell_task::EVENT_NAME, TaskNotify {
        task_id: shell_task.task_id.clone(),
        task_status: TaskStatus::Begin,
        exit_code: None,
        message: "Begin".to_string(),
    })?;
    match shell_task.run(state, window.clone()).await {
        Ok(exit_code) => {
            window.emit(tasks::shell_task::EVENT_NAME, TaskNotify {
                task_id: shell_task.task_id.clone(),
                task_status: TaskStatus::End,
                exit_code,
                message: "End".to_string(),
            })?;
        }
        Err(e) => {
            window.emit(tasks::shell_task::EVENT_NAME, TaskNotify {
                task_id: shell_task.task_id.clone(),
                task_status: TaskStatus::End,
                exit_code: None,
                message: e.to_string(),
            })?;
        },
    };
    Ok(())
}

#[tauri::command]
#[specta::specta]
async fn stop_shell(state: State<'_, AppState>, task_id: String) -> Result<()> {
    stop(state, task_id).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![
        run_shell, stop_shell, get_setting
    ]);

    #[cfg(debug_assertions)]
    {
        use specta_typescript::Typescript;
        use specta_typescript::BigIntExportBehavior;

        let ts = Typescript::default().bigint(BigIntExportBehavior::Number);
        builder
            .export(ts, "../src/bindings.ts")
            .expect("Failed to export typescript bindings");

        let schema = schemars::schema_for!(Setting);
        let json_schema = serde_json::to_string_pretty(&schema).unwrap();
        let resource_path = get_resource_path().expect("err get_resource_path");
        let setting_path = resource_path.join("setting.schema.json");

        let old_json_schema = match read_txt_infer(&setting_path).await {
            Ok(text_content) => {
                match text_content.text {
                    Some(text) => { text }
                    None => { "".to_string() }
                }
            }
            Err(e) => {
                println!("{:?}", e);
                "".to_string()
            }
        };


        // let old_json_schema = match std::fs::read_to_string(setting_path.clone()) {
        //     Ok(schema) => { schema }
        //     Err(_e) => { "".to_string() }
        // };
        if json_schema != old_json_schema {
            let _ =
                std::fs::write(setting_path.clone(), json_schema).map_err(|e| println!("{:?}", e));
        }
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            shell_handles: Arc::new(RwLock::new(HashMap::new())),
        })
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);
            create_menu(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");


    // tauri::Builder::default()
    //     .plugin(tauri_plugin_opener::init())
    //     .invoke_handler(tauri::generate_handler![greet])
    //     .run(tauri::generate_context!())
    //     .expect("error while running tauri application");
}
