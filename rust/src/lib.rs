
mod sim;
mod ode;
mod vector3;

use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;

#[wasm_bindgen(start)]
fn main() {
    console_error_panic_hook::set_once();
}