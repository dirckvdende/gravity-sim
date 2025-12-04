
import type { GravityObject } from "@/sim/object";
import type Vector2 from "@/util/Vector2";
import { ref, toValue, watch, type MaybeRefOrGetter, type Ref } from "vue";

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

/**
 * Composable to keep track of the orbit of a gravity object
 * @param objects Gravity objects to keep the history of
 * @param options Orbit history options, such as maximum orbit length
 * @returns A readonly ref to the orbits, each with an object ID and list of
 * points
 */
export function useOrbitHistory(objects: Ref<GravityObject[]>,
options?: OrbitHistoryOptions): Readonly<Ref<Orbit[]>> {
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

    return orbits
}