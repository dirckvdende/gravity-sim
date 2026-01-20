
import { useGravitySimStore } from "@/stores/useGravitySimStore"
import type { StyledGravityObject } from "./sim/object"
import { storeToRefs } from "pinia"

/**
 * Duplicate an object and add it to the sim. The new object gets a unique ID
 * @param object The object to duplicate
 * @returns The duplicate
 */
export function cloneObject(object: StyledGravityObject): StyledGravityObject {
    const { objects } = storeToRefs(useGravitySimStore())
    let id = 0
    while (objects.value.find(({ id: otherId }) => id == otherId) !=
    undefined)
        id++
    const duplicate: StyledGravityObject = { ...object, id }
    objects.value.push(duplicate)
    return duplicate
}