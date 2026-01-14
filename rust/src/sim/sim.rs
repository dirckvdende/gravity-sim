use super::object::*;
use super::types::*;
use crate::sim::object_vector::GravityObjectVector;
use crate::sim::rkf::{RKFOptions, rkf_next_state};
use std::mem::swap;
use wasm_bindgen::prelude::*;

/// Gravity sim state
#[wasm_bindgen]
pub struct GravitySim {
    /// Gravity sim objects
    #[wasm_bindgen(skip)]
    pub objects: Vec<GravityObject>,
    /// Current time from epoch in seconds
    pub time: Float,
}

#[wasm_bindgen]
impl GravitySim {
    /// Create a new gravity sim object
    #[wasm_bindgen(constructor)]
    pub fn new() -> GravitySim {
        GravitySim {
            objects: Vec::new(),
            time: 0.,
        }
    }

    /// Get the list of gravity objects
    #[wasm_bindgen(getter)]
    pub fn objects(&self) -> Vec<GravityObject> {
        self.objects.clone()
    }

    /// Set the list of gravity objects
    #[wasm_bindgen(setter)]
    pub fn set_objects(&mut self, objects: Vec<GravityObject>) {
        self.objects = objects;
    }

    /// Evolve the sim a given amount of time. Returns the actual amount of time
    /// simulated. This may be smaller than the input time if the maximum number
    /// of steps or compute time have been reached
    pub fn evolve(&mut self, time: Float, options: RKFOptions) -> Float {
        let mut objects: Vec<GravityObject> = Vec::new();
        swap(&mut objects, &mut self.objects);
        let object_vector = GravityObjectVector::from_vec(objects);
        let (sim_time, new_object_vector) =
            rkf_next_state(object_vector, time, options);
        self.objects = new_object_vector.objects;
        self.time += sim_time;
        sim_time
    }
}

// impl GravityVector {
//     fn slope(&self, multiplier: f64) -> GravityVector {
//         let mut slope = self.clone();
//         for object in &mut slope.0 {
//             object.position = object.velocity * multiplier;
//             let force = self.force_on_object(object);
//             let divide = 1. / (object.mass + SMOOTHING_FACTOR);
//             object.velocity = force * multiplier * divide;
//         }
//         slope
//     }

//     fn slope_forward(&self) -> GravityVector {
//         self.slope(1.)
//     }
//     fn slope_backward(&self) -> GravityVector {
//         self.slope(-1.)
//     }

//     fn force_on_object(&self, object: &GravityObject) -> PosVector {
//         let mut total = PosVector::zero();
//         for other in &self.0 {
//             if other.id == object.id {
//                 continue;
//             }
//             let pos_diff = other.position - object.position;
//             let distance = pos_diff.norm().powi(3);
//             let force = pos_diff
//                 * (GRAV_CONSTANT * object.mass * other.mass / distance);
//             total += force;
//         }
//         total
//     }
// }

// #[wasm_bindgen]
// impl GravitySim {
//     /// Evolve the sim a given amount of time. Returns the amount of time
//     /// simulated
//     pub fn evolve(&mut self, time: Float, options: RKFOptions) -> Float {
//         let state = GravityVector(self.objects.clone());
//         let time_abs = time.abs();
//         let backward = time < 0.;
//         let mut rkf = RKFState::new(
//             DiffEq::new(if backward {
//                 GravityVector::slope_backward
//             } else {
//                 GravityVector::slope_forward
//             }),
//             state,
//             options,
//         );
//         let true_time = rkf.evolve(time_abs);
//         self.objects = rkf.state.0;
//         if backward { -true_time } else { true_time }
//     }
// }
