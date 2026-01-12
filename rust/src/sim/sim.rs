
use std::collections::HashMap;
use super::types::*;
use super::object::*;
use crate::ode::DiffEq;
use crate::ode::HasNorm;
use crate::ode::RKFOptions;
use crate::ode::RKFState;
use nalgebra::DVector;
use nalgebra::Matrix;
use nalgebra::dvector;
use nalgebra::vector;

/// Gravity sim state
pub struct GravitySim {
    /// Map of IDs to gravity sim objects
    pub objects: HashMap<ObjectID, GravityObject>,
    /// Current time from epoch in seconds
    pub time: Float,
}

// Alias for vector type used in ODEs
type V = DVector<Float>;

impl HasNorm<Float> for V {
    fn norm(&self) -> Float {
        self.norm()
    }
}

/// Differential equation with initial state/condition
struct DiffEqInitial<Func: Fn(V) -> V> {
    diff_eq: DiffEq<Float, V, Func>,
    initial_state: V,
}

impl GravitySim {
    /// Evolve the sim a given amount of time
    pub fn evolve(&mut self, time: Float, options: RKFOptions) {
        let ode = self.to_ode();
        let mut rkf = GravitySim::to_rkf(ode, options);
        rkf.evolve(time);
        let state = rkf.state.clone();
        drop(rkf);
        self.from_ode_state(state);
    }
    /// Get an initial state and differential equation from a gravity sim state.
    /// Returns a struct with the equation and initial state
    fn to_ode(&mut self) -> DiffEqInitial<impl Fn(V) -> V> {
        let vsize = self.objects[&0].position.len();
        let mut initial_state_vec: Vec<f64> = Vec::new();
        // TODO: Fill initial state vector
        let initial_state = DVector::from_vec(initial_state_vec);
        let slope = |v: V| -> V {
            // TODO: Implement
            v
        };
        DiffEqInitial {
            diff_eq: DiffEq::new(slope),
            initial_state,
        }
    }
    /// Convert a differential equation state to a list of objects and store it
    /// in the gravity sim
    fn from_ode_state(&mut self, state: V) {

    }
    /// Convert differential equation with initial conditions to RKF state
    fn to_rkf<Func: Fn(V) -> V>(
        diff_eq_initial: DiffEqInitial<Func>,
        options: RKFOptions,
    ) -> RKFState<Float, V, Func> {
        RKFState::new(
            diff_eq_initial.diff_eq,
            diff_eq_initial.initial_state,
            options,
        )
    }
}