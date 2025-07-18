mod err;
mod menu;

use tauri_specta::{collect_commands, Builder};
use crate::menu::create_menu;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
#[specta::specta]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![
        greet,
    ]);

    #[cfg(debug_assertions)]
    {
        use specta_typescript::Typescript;
        use specta_typescript::BigIntExportBehavior;

        let ts = Typescript::default().bigint(BigIntExportBehavior::Number);
        builder
            .export(ts, "../src/bindings.ts")
            .expect("Failed to export typescript bindings");
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
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
