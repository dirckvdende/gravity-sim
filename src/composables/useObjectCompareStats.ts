
import type { MaybeRefOrGetter } from "vue";
import type { StyledGravityObject } from "@/util/sim/object";
import { computed, toValue, type ComputedRef } from "vue";
import Vector3 from "@/util/linalg/Vector3";
import { DISTANCE_SMOOTHING, GRAV_CONSTANT } from "@/util/sim/constants";
import { forceOnObject } from "@/util/sim/odeConvert";
import Matrix from "@/util/linalg/Matrix";
import Vector from "@/util/linalg/Vector";

/** Return value of the object compare stats composable */
export type ObjectCompareStatsReturn = {
    /** Distance between the objects */
    distance: ComputedRef<number | undefined>
    /** Ratio between object masses */
    massRatio: ComputedRef<number | undefined>
    /** Ratio between object sizes (diameters if spherical) */
    sizeRatio: ComputedRef<number | undefined>
    /** Relative position to compare object */
    relativePosition: ComputedRef<Vector3 | undefined>
    /** Relative velocity to compare object */
    relativeVelocity: ComputedRef<Vector3 | undefined>
    /**
     * Directional position relative to compare object (directions are given by
     * velocity and acting force of compare object)
     */
    directionalRelativePosition: ComputedRef<Vector3 | undefined>
    /**
     * Directional velocity relative to compare object (directions are given by
     * velocity and acting force of compare object)
     */
    directionalRelativeVelocity: ComputedRef<Vector3 | undefined>
    /** Relative escape velocity between the two objects */
    escapeVelocity: ComputedRef<number | undefined>
    /**
     * Whether the two objects are gravitationally bound (i.e. escape velocity
     * is larger than relative velocity)
     */
    gravBound: ComputedRef<boolean | undefined>
    /** Center of mass of the two objects */
    barycenter: ComputedRef<Vector3 | undefined>
    /**
     * Eccentricity vector of the objects orbit around the other object. The
     * length of this vector is the orbital eccentricity
     */
    eccentricityVector: ComputedRef<Vector3 | undefined>
    /**
     * Semi-major axis of the orbit around the compare object (also works for
     * objects that aren't gravitationally bound)
     */
    semiMajorAxis: ComputedRef<number | undefined>
    /**
     * Orbital period around the compare object (undefined if not
     * gravitationally bound)
     */
    orbitalPeriod: ComputedRef<number | undefined>
}

/**
 * Composable for comparing one gravity object with another
 * @param object The main object of focus
 * @param compareObject The object to compare to. Stats like "mass ratio" will
 * be object.mass / compareObject.mass. Stats like "relative position" will be
 * position of object relative to the compareObject position
 * @param allObjects List of all objects to use for calculating things like
 * gravitational attraction
 */
export function useObjectCompareStats(object: MaybeRefOrGetter<
StyledGravityObject | null | undefined>, compareObject: MaybeRefOrGetter<
StyledGravityObject | null | undefined>, allObjects: MaybeRefOrGetter<
StyledGravityObject[] | null | undefined>): ObjectCompareStatsReturn {

    /**
     * Computed function that returns undefined if either the focus object,
     * compare object, or all objects array is undefined
     * @param func Function to call if focus object, compare object, and all
     * objects array are defined
     * @returns A computed ref to either undefined or the return value of the
     * function
     */
    function definedComputed<T>(func: (curObject: StyledGravityObject,
    curCompareObject: StyledGravityObject, curAllObjects: StyledGravityObject[])
    => T): ComputedRef<T | undefined> {
        return computed(() => {
            const objectValue = toValue(object)
            const compareObjectValue = toValue(compareObject)
            const allObjectsValue = toValue(allObjects)
            if (!objectValue || !compareObjectValue || !allObjectsValue)
                return undefined
            return func(objectValue, compareObjectValue, allObjectsValue)
        })
    }

    const relativePosition = definedComputed((object, otherObject) =>
        object.position.subtract(otherObject.position))
    const relativeVelocity = definedComputed((object, otherObject) =>
        object.velocity.subtract(otherObject.velocity))

    const force = definedComputed((object, _, allObjects) =>
        forceOnObject(object, allObjects))
    const directionalBasis = definedComputed((_, otherObject) => {
        if (!force.value)
            return undefined
        const velocity = new Vector(otherObject.velocity.x,
            otherObject.velocity.y, otherObject.velocity.z)
        const forceVector = new Vector(force.value.x, force.value.y,
            force.value.z)
        const onb = Vector.orthonormalBasis(velocity, forceVector,
            new Vector(1, 0, 0), new Vector(0, 1, 0), new Vector(0, 0, 1))
        if (onb.length != 3)
            return undefined
        return onb as [Vector, Vector, Vector]
    })
    const directionalMatrix = computed(() => {
        const basis = directionalBasis.value
        if (!basis)
            return undefined
        return new Matrix(...basis).transpose().inverse()
    })
    const directionalRelativePosition = computed(() => {
        if (!relativePosition.value || !directionalMatrix.value)
            return undefined
        const v = directionalMatrix.value.multiply(new Vector(
            relativePosition.value.x, relativePosition.value.y,
            relativePosition.value.z))
        return new Vector3(v.get(0), v.get(1), v.get(2))
    })
    const directionalRelativeVelocity = computed(() => {
        if (!relativeVelocity.value || !directionalMatrix.value)
            return undefined
        const v = directionalMatrix.value.multiply(new Vector(
            relativeVelocity.value.x, relativeVelocity.value.y,
            relativeVelocity.value.z))
        return new Vector3(v.get(0), v.get(1), v.get(2))
    })

    const distance = definedComputed((object, otherObject) =>
        object.position.subtract(otherObject.position).length())
    const massRatio = definedComputed((object, otherObject) =>
        object.mass / otherObject.mass)
    const sizeRatio = definedComputed((object, otherObject) =>
        object.size / otherObject.size)
    const escapeVelocity = definedComputed((object, otherObject) => {
        const mass = object.mass + otherObject.mass
        return Math.sqrt(2 * GRAV_CONSTANT * mass / ((distance.value ?? 0) +
            DISTANCE_SMOOTHING))
    })
    const gravBound = definedComputed(() =>
        (relativeVelocity.value?.length() ?? 0) < (escapeVelocity.value ?? 0))
    const barycenter = definedComputed((object, otherObject) => {
        const totalMass = object.mass + otherObject.mass
        if (totalMass == 0)
            return undefined
        return object.position
            .scale(object.mass)
            .add(otherObject.position.scale(otherObject.mass))
            .scale(1 / totalMass)
    })
    const eccentricityVector = definedComputed((object, otherObject) => {
        // Equation: https://en.wikipedia.org/wiki/Eccentricity_vector
        const r = object.position.subtract(otherObject.position)
        const v = object.velocity.subtract(otherObject.velocity)
        const mu = GRAV_CONSTANT * (object.mass + otherObject.mass)
        if (mu == 0 || r.length() == 0)
            return undefined
        const left = r.scale(v.length() * v.length() / mu - 1 / r.length())
        const right = v.scale(r.dot(v) / mu)
        return left.subtract(right)
    })
    const semiMajorAxis = definedComputed((object, otherObject) => {
        // https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes#Energy;
        // _calculation_of_semi-major_axis_from_state_vectors
        const r = object.position.subtract(otherObject.position)
        const v = object.velocity.subtract(otherObject.velocity)
        const mu = GRAV_CONSTANT * (object.mass + otherObject.mass)
        if (v.length() == 0 || mu == 0 || r.length() == 0)
            return undefined
        const epsilon = v.length() * v.length() / 2 - mu / r.length()
        if (epsilon == 0)
            return undefined
        return -mu / (2 * epsilon)
    })
    const orbitalPeriod = definedComputed((object, otherObject) => {
        // https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes#
        // Orbital_period
        if (!gravBound.value)
            return undefined
        const mu = GRAV_CONSTANT * (object.mass + otherObject.mass)
        if (semiMajorAxis.value === undefined || mu == 0)
            return undefined
        return 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis.value, 3) / mu)
    })

    return {
        relativePosition, relativeVelocity, distance, massRatio, sizeRatio,
        escapeVelocity, gravBound, barycenter, eccentricityVector,
        semiMajorAxis, orbitalPeriod, directionalRelativePosition,
        directionalRelativeVelocity,
    }

}