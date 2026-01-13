
use super::types::*;
use super::object::*;
use crate::ode::DiffEq;
use crate::ode::HasNorm;
use crate::ode::RKFOptions;
use crate::ode::RKFState;
use std::iter::zip;
use std::ops::{Mul, Add};
use wasm_bindgen::prelude::*;

/// Gravity sim state
#[wasm_bindgen]
pub struct GravitySim {
    /// Map of IDs to gravity sim objects
    #[wasm_bindgen(skip)]
    pub objects: Vec<GravityObject>,
    /// Current time from epoch in seconds
    pub time: Float,
}

#[wasm_bindgen]
impl GravitySim {
    #[wasm_bindgen(getter)]
    pub fn objects(&self) -> Vec<GravityObject> {
        self.objects.clone()
    }
    #[wasm_bindgen(setter)]
    pub fn set_objects(&mut self, objects: Vec<GravityObject>) {
        self.objects = objects;
    }
}

/// Struct used for ODE calculations
#[derive(Clone)]
struct GravityVector(Vec<GravityObject>);

impl Mul<Float> for GravityVector {
    type Output = GravityVector;
    fn mul(mut self, rhs: Float) -> Self::Output {
        for object in &mut self.0 {
            object.position *= rhs;
            object.velocity *= rhs;
        }
        self
    }
}

impl Add<GravityVector> for GravityVector {
    type Output = GravityVector;
    fn add(mut self, rhs: GravityVector) -> Self::Output {
        for (left, right) in zip(&mut self.0, rhs.0) {
            left.position += right.position;
            left.velocity += right.velocity;
        }
        self
    }
}

impl HasNorm<Float> for GravityVector {
    fn norm(&self) -> Float {
        let mut total = 0.;
        for object in &self.0 {
            total += object.position.norm_squared()
                + object.velocity.norm_squared();
        }
        f64::sqrt(total)
    }
}

impl GravityVector {
    fn slope(&self) -> GravityVector {
        // TODO: Implement
        self.clone()
    }
}

impl GravitySim {
    /// Evolve the sim a given amount of time
    pub fn evolve(&mut self, time: Float, options: RKFOptions) {
        let state = GravityVector(self.objects.clone());
        let mut rkf = RKFState::new(
            DiffEq::new(GravityVector::slope),
            state,
            options,
        );
        rkf.evolve(time);
        self.objects = rkf.state.0;
    }
}