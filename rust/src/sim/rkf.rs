use super::constants::*;
use super::object_vector::GravityObjectVector;
use super::types::*;
use wasm_bindgen::prelude::*;

/// Factors while calculating k's
const BT: [[f64; 6]; 5] = [
    [2. / 9., 0., 0., 0., 0., 0.],
    [1. / 12., 1. / 4., 0., 0., 0., 0.],
    [69. / 128., -243. / 128., 135. / 64., 0., 0., 0.],
    [-17. / 12., 27. / 4., -27. / 5., 16. / 15., 0., 0.],
    [65. / 432., -5. / 16., 13. / 16., 4. / 27., 5. / 144., 0.],
];
/// Factors in front of k's while calculating order 4 approximation
const C4: [f64; 6] = [1. / 9., 0., 9. / 20., 16. / 45., 1. / 12., 0.];
/// Factors in front of k's while calculating order 5 approximation
const C5: [f64; 6] =
    [47. / 450., 0., 12. / 25., 32. / 225., 1. / 30., 6. / 25.];

/// Options for the RKF solver
#[wasm_bindgen]
pub struct RKFOptions {
    /// Tolerance for the solver to determine required step sizes. Lower
    /// tolerance means step size will be smaller
    pub tolerance: f64,
    /// Maximum number of steps to execute during an evolve() call
    pub max_steps: usize,
    /// Maximum time in seconds to spend on an evolve call. Once this threshold
    /// is reached no more steps are executed
    pub max_compute_time: f64,
}

#[wasm_bindgen]
impl RKFOptions {
    #[wasm_bindgen(constructor)]
    /// Create a new options object
    pub fn new(
        tolerance: f64,
        max_steps: usize,
        max_compute_time: f64,
    ) -> RKFOptions {
        RKFOptions {
            tolerance,
            max_steps,
            max_compute_time,
        }
    }
}

/// Perform RKF simulation on a gravity object vector, for the given amount of
/// time (or less if time/steps limit have been reached)
pub fn rkf_next_state(
    state: GravityObjectVector,
    time: Float,
    options: RKFOptions,
) -> (Float, GravityObjectVector) {
    // TODO: Check against max running time
    let mut time_left = time.abs();
    let backward = time < 0.;
    let initial_time = time.clone();
    let tolerance = options.tolerance;
    let mut steps_left = options.max_steps;
    let mut k: [GravityObjectVector; 6] =
        core::array::from_fn(|_| state.clone());
    let mut error = state.clone();
    let mut cur_state = state;
    while time_left > 0. && steps_left > 0 {
        let mut high_error = true;
        let mut h = time_left.clone();
        while high_error {
            // Determine factors k
            for i in 0..k.len() {
                let (before, after) = k.split_at_mut(i);
                let cur_k = &mut after[0];
                cur_state.clone_into(cur_k);
                for j in 0..i {
                    cur_k.add_scaled(&before[j], BT[i - 1][j]);
                }
                slope(cur_k, backward, h);
            }
            // Determine error
            error.set_zero();
            for i in 0..k.len() {
                error.add_scaled(&k[i], C5[i] - C4[i]);
            }
            let error_size = error.norm();
            // Determine if error is low enough
            high_error = error_size > tolerance;
            if high_error {
                h *= 0.9 * (tolerance / error_size).powf(0.2);
            } else {
                for i in 0..k.len() {
                    cur_state.add_scaled(&k[i], C5[i]);
                }
            }
        }
        time_left -= h;
        steps_left -= 1;
    }
    (initial_time - time_left, cur_state)
}

/// Slope at the given state. Changes position, velocity, and force properties
/// of the gravity objects. When backward is true, positions and velocities are
/// multiplied with -1
pub fn slope(
    state: &mut GravityObjectVector,
    backward: bool,
    mut multiplier: Float,
) {
    update_forces(state);
    multiplier *= if backward { -1. } else { 1. };
    for object in &mut state.objects {
        object.position = object.velocity * multiplier;
        object.velocity =
            object.force * multiplier / (object.mass + SMOOTHING_FACTOR);
    }
}

/// Update the forces on the objects in the given state
pub fn update_forces(state: &mut GravityObjectVector) {
    for i in 0..state.objects.len() {
        let mut total = Vector::zero();
        for j in 0..state.objects.len() {
            if i == j {
                continue;
            }
            let mut pos_diff = state.objects[j].position;
            pos_diff -= state.objects[i].position;
            let distance_cubed = pos_diff.norm().powi(3);
            let force = pos_diff
                * (GRAV_CONSTANT
                    * state.objects[i].mass
                    * state.objects[j].mass
                    / distance_cubed);
            total += force;
        }
        state.objects[i].force = total;
    }
}
