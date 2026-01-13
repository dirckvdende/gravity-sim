
use super::constants::*;
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
    #[wasm_bindgen(constructor)]
    pub fn new() -> GravitySim {
        GravitySim { objects: Vec::new(), time: 0. }
    }
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
        Float::sqrt(total)
    }
}

impl GravityVector {
    fn slope(&self, multiplier: f64) -> GravityVector {
        let mut slope = self.clone();
        for object in &mut slope.0 {
            object.position = object.velocity * multiplier;
            let force = self.force_on_object(object);
            let divide = 1. / (object.mass + SMOOTHING_FACTOR);
            object.velocity = force * multiplier * divide;
        }
        slope
    }

    fn slope_forward(&self) -> GravityVector { self.slope(1.) }
    fn slope_backward(&self) -> GravityVector { self.slope(-1.) }

    fn force_on_object(&self, object: &GravityObject) -> PosVector {
        let mut total = PosVector::zero();
        for other in &self.0 {
            if other.id == object.id {
                continue;
            }
            let pos_diff = other.position - object.position;
            let distance = pos_diff.norm_squared().powf(1.5);
            let force = pos_diff * (GRAV_CONSTANT * object.mass * other.mass /
                distance);
            total += force;
        }
        total
    }
}

#[wasm_bindgen]
impl GravitySim {
    /// Evolve the sim a given amount of time. Returns the amount of time
    /// simulated
    pub fn evolve(&mut self, time: Float, options: RKFOptions) -> Float {
        let state = GravityVector(self.objects.clone());
        let time_abs = time.abs();
        let backward = time < 0.;
        let mut rkf = RKFState::new(
            DiffEq::new(if backward {
                GravityVector::slope_backward
            } else {
                GravityVector::slope_forward
            }),
            state,
            options,
        );
        let true_time = rkf.evolve(time_abs);
        self.objects = rkf.state.0;
        if backward { -true_time } else { true_time }
    }
}