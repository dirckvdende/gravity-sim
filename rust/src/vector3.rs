
use wasm_bindgen::prelude::*;
use std::{fmt::Display, ops::{Add, AddAssign, Mul, MulAssign, Sub, SubAssign}};

/// 3D vector type
#[derive(Clone, Copy)]
#[wasm_bindgen]
pub struct Vector3 {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

#[wasm_bindgen]
impl Vector3 {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64, z: f64) -> Vector3 {
        Vector3 { x, y, z }
    }

    pub fn norm(&self) -> f64 {
        f64::sqrt(self.norm_squared())
    }

    pub fn norm_squared(&self) -> f64 {
        self.x * self.x + self.y * self.y + self.z * self.z
    }

    pub fn zero() -> Vector3 {
        Vector3 { x: 0., y: 0., z: 0. }
    }
}

impl Add<Vector3> for Vector3 {
    type Output = Vector3;
    fn add(mut self, rhs: Vector3) -> Self::Output {
        self.x += rhs.x;
        self.y += rhs.y;
        self.z += rhs.z;
        self
    }
}

impl Mul<f64> for Vector3 {
    type Output = Vector3;
    fn mul(mut self, rhs: f64) -> Self::Output {
        self.x *= rhs;
        self.y *= rhs;
        self.z *= rhs;
        self
    }
}

impl Sub<Vector3> for Vector3 {
    type Output = Vector3;
    fn sub(mut self, rhs: Vector3) -> Self::Output {
        self.x -= rhs.x;
        self.y -= rhs.y;
        self.z -= rhs.z;
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

impl MulAssign<f64> for Vector3 {
    fn mul_assign(&mut self, rhs: f64) {
        self.x *= rhs;
        self.y *= rhs;
        self.z *= rhs;
    }
}

impl SubAssign<Vector3> for Vector3 {
    fn sub_assign(&mut self, rhs: Vector3) {
        self.x -= rhs.x;
        self.y -= rhs.y;
        self.z -= rhs.z;
    }
}

impl Display for Vector3 {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let s = format!("Vector3({}, {}, {})", self.x, self.y, self.z);
        f.write_str(s.as_str())
    }
}