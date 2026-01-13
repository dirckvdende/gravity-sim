
mod sim;
mod ode;
mod vector3;

use wasm_bindgen::prelude::*;
use vector3::Vector3;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    let _w = Vector3::new(0., 1., 2.);
    let _y = _w.norm();
    let v = Vector3::new(0., 1., 2.) + Vector3::new(3., 4., 1.);
    alert(&format!("Hello there, {}! The value is {}", name, v));
}