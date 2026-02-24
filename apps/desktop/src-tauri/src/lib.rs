mod typing_engine;
use typing_engine::{EngineState, TypingStats};
use tauri::State;

#[tauri::command]
fn reset_session(state: State<EngineState>, text: String) {
    state.reset(text);
}

#[tauri::command]
fn handle_input(state: State<EngineState>, char_code: char) -> TypingStats {
    state.process_input(char_code)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .manage(EngineState::new())
    .invoke_handler(tauri::generate_handler![reset_session, handle_input])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
