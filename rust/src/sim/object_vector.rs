use super::object::GravityObject;
use super::types::Float;
use std::ops::{
    Add, AddAssign, Div, DivAssign, Mul, MulAssign, Sub, SubAssign,
};

/// Wrapper around Vec<GravityObject> to perform vector operations on their
/// positions and velocities. All other fields remain unchanged
#[derive(Clone)]
pub struct GravityObjectVector {
    /// List of gravity objects
    pub objects: Vec<GravityObject>,
}

impl GravityObjectVector {
    /// Create a new empty vector of objects
    pub fn new() -> GravityObjectVector {
        GravityObjectVector {
            objects: Vec::new(),
        }
    }

    /// Create from vector of objects
    pub fn from_vec(vec: Vec<GravityObject>) -> GravityObjectVector {
        GravityObjectVector { objects: vec }
    }

    /// Euclidean norm of all of the position and velocity vectors concatenated
    pub fn norm(&self) -> Float {
        Float::sqrt(self.norm_squared())
    }

    /// Square of the euclidean norm (see also norm())
    pub fn norm_squared(&self) -> Float {
        let mut total: Float = 0.;
        for object in &self.objects {
            total +=
                object.position.norm_squared() + object.velocity.norm_squared();
        }
        total
    }

    /// Clone the positions and velocities of one object vector into another.
    /// Assumes these vectors have the same size
    pub fn clone_into(&self, other: &mut GravityObjectVector) {
        for i in 0..self.objects.len() {
            other.objects[i].position = self.objects[i].position;
            other.objects[i].velocity = self.objects[i].velocity;
        }
    }

    /// Add a scaled version (position and velocity scaled) of another gravity
    /// object vector to this one
    pub fn add_scaled(&mut self, other: &GravityObjectVector, scale: Float) {
        for i in 0..self.objects.len() {
            self.objects[i].position += other.objects[i].position * scale;
            self.objects[i].velocity += other.objects[i].velocity * scale;
        }
    }

    /// Set all positions and velocities to zero
    pub fn set_zero(&mut self) {
        for object in &mut self.objects {
            object.position.set_zero();
            object.velocity.set_zero();
        }
    }
}

impl Add<GravityObjectVector> for GravityObjectVector {
    type Output = GravityObjectVector;
    fn add(mut self, rhs: GravityObjectVector) -> Self::Output {
        // Assumes self.objects.len() == rhs.objects.len()
        self.add_assign(rhs);
        self
    }
}

impl AddAssign<GravityObjectVector> for GravityObjectVector {
    fn add_assign(&mut self, rhs: GravityObjectVector) {
        // Assumes self.objects.len() == rhs.objects.len()
        for i in 0..self.objects.len() {
            self.objects[i].position += rhs.objects[i].position;
            self.objects[i].velocity += rhs.objects[i].velocity;
        }
    }
}

impl Sub<GravityObjectVector> for GravityObjectVector {
    type Output = GravityObjectVector;
    fn sub(mut self, rhs: GravityObjectVector) -> Self::Output {
        // Assumes self.objects.len() == rhs.objects.len()
        self.sub_assign(rhs);
        self
    }
}

impl SubAssign<GravityObjectVector> for GravityObjectVector {
    fn sub_assign(&mut self, rhs: GravityObjectVector) {
        // Assumes self.objects.len() == rhs.objects.len()
        for i in 0..self.objects.len() {
            self.objects[i].position -= rhs.objects[i].position;
            self.objects[i].velocity -= rhs.objects[i].velocity;
        }
    }
}

impl Mul<Float> for GravityObjectVector {
    type Output = GravityObjectVector;
    fn mul(mut self, rhs: Float) -> Self::Output {
        self.mul_assign(rhs);
        self
    }
}

impl Mul<GravityObjectVector> for Float {
    type Output = GravityObjectVector;
    fn mul(self, mut rhs: GravityObjectVector) -> Self::Output {
        rhs.mul_assign(self);
        rhs
    }
}

impl MulAssign<Float> for GravityObjectVector {
    fn mul_assign(&mut self, rhs: Float) {
        for i in 0..self.objects.len() {
            self.objects[i].position *= rhs;
            self.objects[i].velocity *= rhs;
        }
    }
}

impl Div<Float> for GravityObjectVector {
    type Output = GravityObjectVector;
    fn div(mut self, rhs: Float) -> Self::Output {
        self.div_assign(rhs);
        self
    }
}

impl DivAssign<Float> for GravityObjectVector {
    fn div_assign(&mut self, rhs: Float) {
        for i in 0..self.objects.len() {
            self.objects[i].position /= rhs;
            self.objects[i].velocity /= rhs;
        }
    }
}
