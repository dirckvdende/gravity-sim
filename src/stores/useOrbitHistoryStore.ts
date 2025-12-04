
import type { GravityObject } from "@/sim/object";
import type Vector2 from "@/util/Vector2";
import { defineStore, storeToRefs } from "pinia";
import { ref, toValue, watch, type MaybeRefOrGetter, type Ref } from "vue";
import { useGravitySimStore } from "./useGravitySimStore";

/** Orbit of a gravity object */
export type Orbit = {
    /** ID of the gravity object */
    id: number
    /** Points that make up the orbit */
    points: Vector2[]
}

/** Options to pass to the orbit history composable */
export type OrbitHistoryOptions = {
    /** Maximum length of an orbit (default 1000) */
    maxLength?: MaybeRefOrGetter<number>
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
            if (orbit.points.length > toValue(options?.maxLength ?? 1000))
                orbit.points.splice(0, 1)
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
    const maxLength = ref(1000)
    const orbitHistory = useOrbitHistory(objects, { maxLength })
    return { ...orbitHistory, maxLength }
})