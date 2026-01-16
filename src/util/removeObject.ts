
import { useGravitySimStore } from "@/stores/useGravitySimStore";
import { useMenuStore } from "@/stores/useMenuStore";
import { useLockStore } from "@/stores/useLockStore";
import { storeToRefs } from "pinia";
import type { StyledGravityObject } from "./sim/object";

/**
 * Remove an object from the sim and make sure it's no longer focused or locked
 * onto
 */
export function removeObject(object: StyledGravityObject): void {
    const { objects } = storeToRefs(useGravitySimStore())
    const { focusedObject } = storeToRefs(useMenuStore())
    const { lockedObject } = storeToRefs(useLockStore())
    objects.value = objects.value.filter((other) => other != object)
    focusedObject.value = null
    lockedObject.value = null
}