use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = performance)]
    fn now() -> f64;
}

/// Current time in seconds. Can be used to measure durations
pub fn js_now() -> f64 { now() / 1000. }