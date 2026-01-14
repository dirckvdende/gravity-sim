
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
    pub position: Vector,
    /// Object velocity vector
    pub velocity: Vector,
    /// Mass in kg of the object
    pub mass: Float,
    /// Force currently acting on an object
    #[wasm_bindgen(skip)]
    pub force: Vector,
}

#[wasm_bindgen]
impl GravityObject {
    #[wasm_bindgen(constructor)]
    /// Create a new gravity object
    pub fn new(
        id: ObjectID,
        position: Vector,
        velocity: Vector,
        mass: Float,
    ) -> GravityObject {
        GravityObject { id, position, velocity, mass, force: Vector::zero() }
    }
}