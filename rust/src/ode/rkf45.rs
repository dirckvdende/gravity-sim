
use super::ode::*;
use std::{iter::zip, time::{Duration, Instant}};

/// Linear combination of vectors, with factors as f64
fn linear_comb<B, V, const S: usize>(factors: &[f64; S], vectors: &[V; S]) -> V
where
    B: ScalarLike<B>,
    V: VectorLike<B, V>,
{
    let mut out = vectors[0].clone() * B::from(0.);
    for (f, v) in zip(factors, vectors) {
        out = out + v.clone() * B::from(*f);
    }
    out
}

/// Calculate k_i from k_1, ..., k_i-1. Uses the previous factors of k with
/// zeros in places that haven't been calculated yet. Factors from the table B
/// are given as the second argument. The factor h should be given as the third
/// argument. The current index i is the fourth argument. Lastly the slope
/// function should be given
fn next_k<B, V>(
    k: &mut [V; 6],
    h: B,
    index: usize,
    slope: impl Fn(&V) -> V,
) where
    B: ScalarLike<B>,
    V: VectorLike<B, V>,
{
    let b = &B[index];
    let x = linear_comb(&b, &k);
    let new_k = slope(&x) * h;
    k[index] = new_k;
}

/// Options for the RKF solver
pub struct RKFOptions {
    /// Tolerance for the solver to determine required step sizes. Lower
    /// tolerance means step size will be smaller
    pub tolerance: f64,
    /// Maximum number of steps to execute during an evolve() call
    pub max_steps: usize,
    /// Maximum time in seconds to spend on an evolve call. Once this threshold
    /// is reached no more steps are executed
    pub max_compute_time: Duration,
}

/// Factors while calculating k's
const B: [[f64; 6]; 5] = [
    [2. / 9., 0., 0., 0., 0., 0.],
    [1. / 12., 1. / 4., 0., 0., 0., 0.],
    [69. / 128., -243. / 128., 135. / 64., 0., 0., 0.],
    [-17. / 12., 27. / 4., -27. / 5., 16. / 15., 0., 0.],
    [65. / 432., -5. / 16., 13. / 16., 4. / 27., 5. / 144., 0.],
];
/// Factors in front of k's while calculating order 4 approximation
const C4: [f64; 6] = [1. / 9., 0., 9. / 20., 16. / 45., 1. / 12., 0.];
/// Factors in front of k's while calculating order 5 approximation
const C5: [f64; 6] = [47. / 450., 0., 12. / 25., 32. / 225., 1. / 30.,
    6. / 25.];

/// State of the RKF solver
pub struct RKFState<B, V, Func>
where
    B: ScalarLike<B>,
    V: VectorLike<B, V>,
    Func: Fn(&V) -> V,
{
    /// Differential equation to simulate
    pub diff_eq: DiffEq<B, V, Func>,
    /// Current state
    pub state: V,
    /// Solver options
    pub options: RKFOptions,
}

impl<B, V, Func> RKFState<B, V, Func>
where
    B: ScalarLike<B>,
    V: VectorLike<B, V>,
    Func: Fn(&V) -> V,
{
    /// Create a new RKF state
    pub fn new(
        diff_eq: DiffEq<B, V, Func>,
        state: V,
        options: RKFOptions,
    ) -> RKFState<B, V, Func> {
        RKFState { diff_eq, state, options }
    }

    /// Evolve the state by a given amount of time. Returns the amount of time
    /// that was actually evolved. This is equal to time, unless max_steps or
    /// max_compute_time has been reached
    pub fn evolve(&mut self, mut time: B) -> B {
        let initial_time = time.clone();
        let start_time = Instant::now();
        let RKFOptions {
            tolerance,
            mut max_steps,
            max_compute_time,
            ..
        } = self.options;
        let zero = self.state.clone() * B::from(0.);
        while time.clone().into() > 0. && max_steps > 0 && start_time.elapsed() <
        max_compute_time {
            let mut high_error = true;
            let mut h = time.clone();
            while high_error {
                let mut k: [V; 6] = core::array::from_fn(|_| zero.clone());
                for i in 0..k.len() {
                    next_k(&mut k, h.clone(), i, &self.diff_eq.slope);
                }
                let order4 = self.state.clone() + linear_comb(&C4, &k);
                let order5 = self.state.clone() + linear_comb(&C5, &k);
                let error: f64 = B::into(
                    (order4.clone() + (order5 * B::from(-1.))).norm());
                high_error = error > tolerance;
                if high_error {
                    h = B::from(0.9 * (tolerance / error).powf(0.2))
                        * h.clone();
                } else {
                    self.state = order4;
                }
            }
            time = time - h;
            max_steps -= 1;
        }
        initial_time - time
    }
}