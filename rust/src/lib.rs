
use wasm_bindgen::prelude::*;

pub mod linalg;
use linalg::vector3::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    let v = Vector3::new(0., 1., 2.) + Vector3::new(3., 4., 1.);
    alert(&format!("Hello there, {}! The value is {}", name, v));
}