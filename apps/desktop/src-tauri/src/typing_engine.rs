use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use std::time::Instant;

#[derive(Clone, Debug)]
pub struct TypingSession {
    pub target_text: String,
    pub input_history: Vec<char>,
    pub start_time: Option<Instant>,
    pub keystrokes: u32,
    pub errors: u32,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TypingStats {
    pub wpm: f64,
    pub accuracy: f64,
    pub consistency: f64,
    pub raw_wpm: f64,
}

pub struct EngineState {
    pub session: Mutex<TypingSession>,
}

impl EngineState {
    pub fn new() -> Self {
        Self {
            session: Mutex::new(TypingSession {
                target_text: String::new(),
                input_history: Vec::new(),
                start_time: None,
                keystrokes: 0,
                errors: 0,
            }),
        }
    }

    pub fn reset(&self, text: String) {
        let mut session = self.session.lock().unwrap();
        session.target_text = text;
        session.input_history.clear();
        session.start_time = None;
        session.keystrokes = 0;
        session.errors = 0;
    }

    pub fn process_input(&self, char_code: char) -> TypingStats {
        let mut session = self.session.lock().unwrap();
        
        // Start timer on first input
        if session.start_time.is_none() {
            session.start_time = Some(Instant::now());
        }

        session.input_history.push(char_code);
        session.keystrokes += 1;

        // Check correctness
        let current_index = session.input_history.len() - 1;
        if let Some(target_char) = session.target_text.chars().nth(current_index) {
            if char_code != target_char {
                session.errors += 1;
            }
        }

        // Calculate Stats
        let elapsed_minutes = session.start_time.unwrap().elapsed().as_secs_f64() / 60.0;
        
        let gross_wpm = (session.keystrokes as f64 / 5.0) / elapsed_minutes;
        let net_wpm = gross_wpm - (session.errors as f64 / elapsed_minutes);
        let accuracy = if session.keystrokes > 0 {
            100.0 * (1.0 - (session.errors as f64 / session.keystrokes as f64))
        } else {
            100.0
        };

        TypingStats {
            wpm: if net_wpm < 0.0 { 0.0 } else { net_wpm },
            raw_wpm: gross_wpm,
            accuracy,
            consistency: 1.0, // TODO: Implement CV (Coefficient of Variation) logic
        }
    }
}
