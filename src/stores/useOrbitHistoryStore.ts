
import type { GravityObject } from "@/sim/object";
import type Vector2 from "@/util/Vector2";
import { defineStore, storeToRefs } from "pinia";
import { ref, toValue, watch, type MaybeRefOrGetter, type Ref } from "vue";
import { useGravitySimStore } from "./useGravitySimStore";

/** Orbit of a gravity object */
export type Orbit = {
    /** ID of the gravity object */
    id: number
    /** Points that make up the orbit, where null should be ignored */
    points: (Vector2 | null)[]
}

/** Options to pass to the orbit history composable */
export type OrbitHistoryOptions = {
    /** Maximum length of an orbit (default 1000) */
    maxLength?: MaybeRefOrGetter<number>
    /**
     * Minimum angle in radian between line segment. If the angle between
     * previous two lines is smaller, the point connecting these two lines is
     * removed (default 0)
     */
    minAngle?: MaybeRefOrGetter<number>
    /**
     * Maximum number of null entries at the start of the orbit points list, as
     * a proportion of the max length. This improves performance since it
     * prevents many array slice() calls (default 0.2)
     */
    nullPaddingSize?: number
}

/** Return type of the orbit history composable */
export type OrbitHistoryReturn = {
    /** List of tracked orbits */
    orbits: Readonly<Ref<Orbit[]>>
    /** Function that can be called to clear the entire history */
    clearOrbits(): void
}

/**
 * Composable to keep track of the orbit of a gravity object
 * @param objects Gravity objects to keep the history of
 * @param options Orbit history options, such as maximum orbit length
 * @returns A readonly ref to the orbits, each with an object ID and list of
 * points, and a clearOrbits() function to clear all history
 */
export function useOrbitHistory(objects: Ref<GravityObject[]>,
options?: OrbitHistoryOptions): OrbitHistoryReturn {
    const orbits = ref<Orbit[]>([])

    watch(objects, (value) => {
        const valueMap = new Map(value.map((object) => [ object.id, object ]))
        const orbitIds = new Set(orbits.value.map(({ id }) => id))
        for (const { id } of value)
            if (!orbitIds.has(id))
                orbits.value.push({
            id,
            points: [],
        })
        const removeIds: number[] = []
        for (const orbit of orbits.value) {
            const object = valueMap.get(orbit.id)
            if (!object) {
                removeIds.push(orbit.id)
                continue
            }
            orbit.points.push(object.position)
            if (orbit.points.length >= 3 &&
            toValue(options?.minAngle ?? 0) != 0) {
                const curLine = orbit.points[orbit.points.length - 1]!
                    .subtract(orbit.points[orbit.points.length - 2]!)
                const prevLine = orbit.points[orbit.points.length - 2]!
                    .subtract(orbit.points[orbit.points.length - 3]!)
                const angle = curLine.angle(prevLine)
                if (Math.min(angle, 2 * Math.PI - angle) < toValue(
                options?.minAngle ?? 0)) {
                    orbit.points.pop()
                    orbit.points.pop()
                    orbit.points.push(object.position)
                }
            }
            const maxLength = toValue(options?.maxLength ?? 1000)
            const nullBufferSize = toValue(options?.nullPaddingSize ?? 0.2)
            if (orbit.points.length > maxLength)
                orbit.points[orbit.points.length - maxLength - 1] = null
            if (orbit.points.length > (1 + nullBufferSize) * maxLength)
                orbit.points = orbit.points.filter((value) => value != null)
        }
        // Force update ref
        orbits.value = orbits.value.slice()
    })

    /**
     * Clear the entire orbit history
     */
    function clearOrbits(): void {
        orbits.value = []
    }

    return { orbits, clearOrbits }
}

/** Store version of orbit history */
export const useOrbitHistoryStore = defineStore("orbit-history", () => {
    const { objects } = storeToRefs(useGravitySimStore())
    const maxLength = ref(100)
    const minAngle = ref(2 * Math.PI / 100)
    const orbitHistory = useOrbitHistory(objects, { maxLength, minAngle })
    return { ...orbitHistory, maxLength, minAngle }
})