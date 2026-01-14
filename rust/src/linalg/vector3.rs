use std::{
    fmt::Display,
    ops::{Add, AddAssign, Mul, MulAssign, Sub, SubAssign, Div, DivAssign},
};
use wasm_bindgen::prelude::*;

/// 3D vector type
#[derive(Clone, Copy)]
#[wasm_bindgen]
pub struct Vector3 {
    /// First coordinate of the vector
    pub x: f64,
    /// Second coordinate of the vector
    pub y: f64,
    /// Third coordinate of the vector
    pub z: f64,
}

#[wasm_bindgen]
impl Vector3 {
    /// Create a new vector with the given coordinates
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64, z: f64) -> Vector3 {
        Vector3 { x, y, z }
    }

    /// Create a vector with zero coordinates
    pub fn zero() -> Vector3 {
        Vector3 {
            x: 0.,
            y: 0.,
            z: 0.,
        }
    }

    /// Euclidean norm of the vector
    pub fn norm(&self) -> f64 {
        f64::sqrt(self.norm_squared())
    }

    /// Squared euclidean norm of the vector
    pub fn norm_squared(&self) -> f64 {
        self.x * self.x + self.y * self.y + self.z * self.z
    }

    /// Add a scaled version of a vector to the current vector
    pub fn add_scaled(&mut self, other: &Vector3, scale: f64) {
        self.x += other.x * scale;
        self.y += other.y * scale;
        self.z += other.z * scale;
    }

    /// Set this vector to the zero vector
    pub fn set_zero(&mut self) {
        self.x = 0.;
        self.y = 0.;
        self.z = 0.;
    }
}

impl Add<Vector3> for Vector3 {
    type Output = Vector3;
    fn add(mut self, rhs: Vector3) -> Self::Output {
        self.add_assign(rhs);
        self
    }
}

impl AddAssign<Vector3> for Vector3 {
    fn add_assign(&mut self, rhs: Vector3) {
        self.x += rhs.x;
        self.y += rhs.y;
        self.z += rhs.z;
    }
}

impl Mul<f64> for Vector3 {
    type Output = Vector3;
    fn mul(mut self, rhs: f64) -> Self::Output {
        self.mul_assign(rhs);
        self
    }
}

impl MulAssign<f64> for Vector3 {
    fn mul_assign(&mut self, rhs: f64) {
        self.x *= rhs;
        self.y *= rhs;
        self.z *= rhs;
    }
}

impl Mul<Vector3> for f64 {
    type Output = Vector3;
    fn mul(self, mut rhs: Vector3) -> Self::Output {
        rhs.mul_assign(self);
        rhs
    }
}

impl Sub<Vector3> for Vector3 {
    type Output = Vector3;
    fn sub(mut self, rhs: Vector3) -> Self::Output {
        self.sub_assign(rhs);
        self
    }
}

impl SubAssign<Vector3> for Vector3 {
    fn sub_assign(&mut self, rhs: Vector3) {
        self.x -= rhs.x;
        self.y -= rhs.y;
        self.z -= rhs.z;
    }
}

impl Div<f64> for Vector3 {
    type Output = Vector3;
    fn div(mut self, rhs: f64) -> Self::Output {
        self.div_assign(rhs);
        self
    }
}

impl DivAssign<f64> for Vector3 {
    fn div_assign(&mut self, rhs: f64) {
        self.x /= rhs;
        self.y /= rhs;
        self.z /= rhs;
    }
}

impl Display for Vector3 {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let s = format!("Vector3({}, {}, {})", self.x, self.y, self.z);
        f.write_str(s.as_str())
    }
}
