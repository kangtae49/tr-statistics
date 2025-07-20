use crate::err::Result;
use tauri::menu::{MenuBuilder, SubmenuBuilder};
use tauri::{App, Emitter};

pub fn create_menu(app: &mut App) -> Result<()> {
    let file_menu = SubmenuBuilder::new(app, "File")
        .text("tasks", "Tasks")
        .text("open", "Open")
        .text("quit", "Quit")
        .build()?;

    let help_menu = SubmenuBuilder::new(app, "Help")
        .text("about", "About")
        .build()?;

    let sample_menu = SubmenuBuilder::new(app, "Sample")
        .text("bar-chart", "Bar Chart")
        .text("line-chart", "Line Chart")
        .build()?;

    let menu = MenuBuilder::new(app)
        .items(&[&file_menu, &sample_menu, &help_menu])
        .build()?;
    app.set_menu(menu)?;

    app.on_menu_event(move |app_handle: &tauri::AppHandle, event| {
        println!("menu event: {:?}", event.id());
        match event.id().0.as_str() {
            "open" => {
                println!("open event");
            }
            "quit" => {
                println!("quit event");
                app_handle.exit(0);
            }
            "tasks" => {
                println!("tasks event");
                app_handle.emit("navigate", "/tasks").unwrap();
            }
            "about" => {
                println!("about event");
                app_handle.emit("navigate", "/about").unwrap();
            }
            "bar-chart" => {
                println!("bar-chart event");
                app_handle.emit("navigate", "/bar-chart").unwrap();
            }
            "line-chart" => {
                println!("line-chart event");
                app_handle.emit("navigate", "/line-chart").unwrap();
            }
            _ => {
                println!("unexpected menu event");
            }
        }
    });

    Ok(())
}
