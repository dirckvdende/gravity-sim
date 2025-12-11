
import type Vector2 from "@/util/Vector2";
import type { StyledGravityObject } from "./object";
import { toValue, computed, type ComputedRef, type MaybeRefOrGetter } from
"vue";
import { forceOnObject } from "./odeConvert";

/** Return value of the objects stat composable */
export type ObjectStatsReturn = {
    /** Name of the object */
    name: ComputedRef<string | undefined>
    /** Mass of the object in kg */
    mass: ComputedRef<number | undefined>
    /** Size of the object (diameter if spherical) */
    size: ComputedRef<number | undefined>
    /** Position of the object */
    position: ComputedRef<Vector2 | undefined>
    /** Velocity of the object */
    velocity: ComputedRef<Vector2 | undefined>
    /** Force acting on the object */
    force: ComputedRef<Vector2 | undefined>
}

/**
 * 
 * @param object The object to get the stats of
 * @param allObjects List of all objects to use for calculating things like
 * gravitational attraction
 * @returns Object with the stats of the object
 */
export function useObjectStats(object: MaybeRefOrGetter<StyledGravityObject |
null | undefined>, allObjects: MaybeRefOrGetter<StyledGravityObject[] | null |
undefined>): ObjectStatsReturn {

    /**
     * Computed function that returns undefined if either the focus object or
     * all objects array is undefined
     * @param func Function to call if focus object and all objects are defined
     * @returns A computed ref to either undefined or the return value of the
     * function
     */
    function definedComputed<T>(func: (curObject: StyledGravityObject,
    curAllObjects: StyledGravityObject[]) => T): ComputedRef<T | undefined> {
        return computed(() => {
            const objectValue = toValue(object)
            const allObjectsValue = toValue(allObjects)
            if (!objectValue || !allObjectsValue)
                return undefined
            return func(objectValue, allObjectsValue)
        })
    }

    const name = definedComputed(({ name }) => name)
    const mass = definedComputed(({ mass }) => mass)
    const size = definedComputed(({ size }) => size)
    const position = definedComputed(({ position }) => position)
    const velocity = definedComputed(({ velocity }) => velocity)
    const force = definedComputed(forceOnObject)

    return { name, mass, size, position, velocity, force }
}