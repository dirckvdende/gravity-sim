
import type { MaybeRefOrGetter } from "vue";
import type { StyledGravityObject } from "./object";
import { computed, toValue, type ComputedRef } from "vue";
import type Vector2 from "@/util/Vector2";
import { DISTANCE_SMOOTHING, GRAV_CONSTANT } from "./constants";

/** Return value of the object compare stats composable */
export type ObjectCompareStatsReturn = {
    /** Distance between the objects */
    distance: ComputedRef<number | undefined>
    /** Ratio between object masses */
    massRatio: ComputedRef<number | undefined>
    /** Ratio between object sizes (diameters if spherical) */
    sizeRatio: ComputedRef<number | undefined>
    /** Relative position to compare object */
    relativePosition: ComputedRef<Vector2 | undefined>
    /** Relative velocity to compare object */
    relativeVelocity: ComputedRef<Vector2 | undefined>
    /** Relative escape velocity between the two objects */
    escapeVelocity: ComputedRef<number | undefined>
    /**
     * Whether the two objects are gravitationally bound (i.e. escape velocity
     * is larger than relative velocity)
     */
    gravBound: ComputedRef<boolean | undefined>
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

    return {
        relativePosition, relativeVelocity, distance, massRatio, sizeRatio,
        escapeVelocity, gravBound,
    }

}