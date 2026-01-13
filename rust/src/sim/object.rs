
use crate::sim::types::*;
use wasm_bindgen::prelude::*;

/// Type alias used for object IDs
pub type ObjectID = u32;

/// Object in the gravity sim, with a unique ID, position, velocity, and mass
#[derive(Clone, Copy)]
#[wasm_bindgen]
pub struct GravityObject {
    /// ID of the object
    pub id: ObjectID,
    /// Object position in space
    pub position: PosVector,
    /// Object velocity vector
    pub velocity: PosVector,
    /// Mass in kg of the object
    pub mass: Float,
}

#[wasm_bindgen]
impl GravityObject {
    #[wasm_bindgen(constructor)]
    pub fn new(
        id: ObjectID,
        position: PosVector,
        velocity: PosVector,
        mass: Float,
    ) -> GravityObject {
        GravityObject { id, position, velocity, mass }
    }
}