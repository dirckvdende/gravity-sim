
use wasm_bindgen::prelude::*;
use std::{fmt::Display, ops::Add};

/// 3-component vector with x, y, z
#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, PartialOrd)]
pub struct Vector3 {
    x: f64,
    y: f64,
    z: f64,
}

impl Display for Vector3 {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_fmt(format_args!("Vector3({}, {}, {})", self.x, self.y, self.z))
    }
}

impl Add<Vector3> for Vector3 {
    type Output = Vector3;
    fn add(self, rhs: Vector3) -> Self::Output {
        Vector3::new(self.x + rhs.x, self.y + rhs.y, self.z + rhs.z)
    }
}

impl Vector3 {
    /// Zero vector
    pub const ZERO: Vector3 = Self::new(0.0, 0.0, 0.0);

    /// Create a new vector
    pub const fn new(x: f64, y: f64, z: f64) -> Self {
        Self { x, y, z }
    }

    /// Euclidean length of a vector
    pub fn length(&self) -> f64 {
        f64::sqrt(self.x * self.x + self.y * self.y + self.z * self.z)
    }

}