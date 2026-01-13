use std::marker::PhantomData;
use std::ops::{Add, Sub, Mul, Div};

/// Trait for structs that have a norm() function, returning the L2 norm
pub trait HasNorm<B> {
    /// L2 norm
    fn norm(&self) -> B;
}

/// Alias for scalar-like types
pub trait ScalarLike<B>:
    Add<B, Output = B>
    + Sub<B, Output = B>
    + Mul<B, Output = B>
    + Div<B, Output = B>
    + From<f64>
    + Into<f64>
    + Clone
{}

// This removes the need to type "impl ScalarLike" for all scalar-like types
impl<B, T> ScalarLike<B> for T
where T:
    Add<B, Output = B>
    + Sub<B, Output = B>
    + Mul<B, Output = B>
    + Div<B, Output = B>
    + From<f64>
    + Into<f64>
    + Clone
{}

/// Alias for vector-like structs supporting scalar multiplication, addition,
/// and taking the norm
pub trait VectorLike<B, V>:
    Mul<B, Output = V>
    + Add<V, Output = V>
    + HasNorm<B>
    + Clone
where
    B: ScalarLike<B>,
{}

// This removes the need to type "impl VectorLike" for all vector-like types
impl<B, V, T> VectorLike<B, V> for T
where
    B: ScalarLike<B>,
    T:
        Mul<B, Output = V>
        + Add<V, Output = V>
        + HasNorm<B>
        + Clone,
{}

/// Ordinary differential equation
pub struct DiffEq<B, V, Func>
where
    B: ScalarLike<B>,
    V: VectorLike<B, V>,
    Func: Fn(&V) -> V,
{
    pub slope: Func,
    _phantoms: PhantomData<(B, V)>,
}

impl<B, V, Func> DiffEq<B, V, Func>
where
    B: ScalarLike<B>,
    V: VectorLike<B, V>,
    Func: Fn(&V) -> V,
{
    /// Create a new ordinary differential equation from a slope function
    pub fn new(slope: Func) -> DiffEq<B, V, Func> {
        DiffEq {
            slope,
            _phantoms: PhantomData,
        }
    }
}
