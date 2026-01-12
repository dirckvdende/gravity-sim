
use std::collections::HashMap;
use super::types::*;
use super::object::*;

/// Gravity sim state
pub struct GravitySim {
    /// Map of IDs to gravity sim objects
    pub objects: HashMap<ObjectID, GravityObject>,
    /// Current time from epoch in seconds
    pub time: Float,
}