
use crate::sim::types::*;

/// Type alias used for object IDs
pub type ObjectID = u32;

/// Object in the gravity sim, with a unique ID, position, velocity, and mass
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