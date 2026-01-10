use std::{
    fmt::Display,
    ops::{Add, AddAssign, Div, DivAssign, Mul, MulAssign, Neg, Sub, SubAssign},
};
use wasm_bindgen::prelude::*;

// Alias for float type used by vectors
type Float = f64;

// Threshold for the length of a vector to be included in an orthonormal basis
const ONB_THRESHOLD: Float = 1e-9;

/// 3-component vector with x, y, z
#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, PartialOrd)]
pub struct Vector3 {
    pub x: Float,
    pub y: Float,
    pub z: Float,
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

impl AddAssign<Vector3> for Vector3 {
    fn add_assign(&mut self, rhs: Vector3) {
        self.x += rhs.x;
        self.y += rhs.y;
        self.z += rhs.z;
    }
}

impl Sub<Vector3> for Vector3 {
    type Output = Vector3;
    fn sub(self, rhs: Vector3) -> Self::Output {
        Vector3::new(self.x - rhs.x, self.y - rhs.y, self.z - rhs.z)
    }
}

impl SubAssign<Vector3> for Vector3 {
    fn sub_assign(&mut self, rhs: Vector3) {
        self.x -= rhs.x;
        self.y -= rhs.y;
        self.z -= rhs.z;
    }
}

impl Mul<Float> for Vector3 {
    type Output = Vector3;
    fn mul(self, rhs: Float) -> Self::Output {
        Vector3::new(self.x * rhs, self.y * rhs, self.z * rhs)
    }
}

impl Mul<Vector3> for Float {
    type Output = Vector3;
    fn mul(self, rhs: Vector3) -> Self::Output {
        Vector3::new(self * rhs.x, self * rhs.y, self * rhs.z)
    }
}

impl MulAssign<Float> for Vector3 {
    fn mul_assign(&mut self, rhs: Float) {
        self.x *= rhs;
        self.y *= rhs;
        self.z *= rhs;
    }
}

impl Div<Float> for Vector3 {
    type Output = Vector3;
    fn div(self, rhs: Float) -> Self::Output {
        Vector3::new(self.x / rhs, self.y / rhs, self.z / rhs)
    }
}

impl DivAssign<Float> for Vector3 {
    fn div_assign(&mut self, rhs: Float) {
        self.x /= rhs;
        self.y /= rhs;
        self.z /= rhs;
    }
}

impl Neg for Vector3 {
    type Output = Vector3;
    fn neg(self) -> Self::Output {
        Vector3::new(-self.x, -self.y, -self.z)
    }
}

impl Vector3 {
    /// Zero vector
    pub const ZERO: Self = Self {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    };

    /// Create a new vector
    pub fn new(x: Float, y: Float, z: Float) -> Self {
        Self { x, y, z }
    }

    /// Euclidean length of the vector
    pub fn length(&self) -> Float {
        Float::sqrt(self.length2())
    }

    /// Euclidean length of the vector, squared
    pub fn length2(&self) -> Float {
        self.dot(*self)
    }

    /// Dot product of two vectors
    pub fn dot(&self, rhs: Vector3) -> Float {
        self.x * rhs.x + self.y * rhs.y + self.z * rhs.z
    }

    /// Cross product of two vectors, resulting in a vector that is orthogonal
    /// to the two vectors
    pub fn cross(&self, rhs: Vector3) -> Vector3 {
        Vector3::new(
            self.y * rhs.z - self.z * rhs.y,
            self.z * rhs.x - self.x * rhs.z,
            self.x * rhs.y - self.y * rhs.x,
        )
    }

    /// Normalize the vector to length 1. If the vector is the zero vector,
    /// leave it unchanged
    pub fn normalize(&mut self) {
        let length = self.length();
        if length == 0.0 {
            return;
        }
        *self /= length;
    }

    /// Returns whether this is the zero vector
    pub fn is_zero(&self) -> bool {
        self.x == 0.0 && self.y == 0.0 && self.z == 0.0
    }

    /// Distance between two vectors
    pub fn distance_to(&self, rhs: Vector3) -> f64 {
        (*self - rhs).length()
    }

    /// Orthogonally project this vector onto the line spanned by another
    /// vector. If the other vector is the zero vector, the zero vector is
    /// returned
    pub fn project_onto(&self, span: Vector3) -> Vector3 {
        if span.is_zero() {
            Vector3::ZERO
        } else {
            span * self.dot(span) / span.length2()
        }
    }

    /// Get an orthonormal basis of a space spanned by the given list of
    /// vectors. Vectors are only included if they have length >= ONB_THRESHOLD
    pub fn orthonormal_basis(vectors: Vec<Vector3>) -> Vec<Vector3> {
        let mut out: Vec<Vector3> = Vec::new();
        for v in vectors {
            let mut cur = v;
            for u in &out {
                cur -= v.project_onto(*u);
            }
            if cur.length() >= ONB_THRESHOLD {
                out.push(cur);
            }
        }
        out
    }
}
