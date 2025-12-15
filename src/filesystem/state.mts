
import { useGravitySimStore } from "@/stores/useGravitySimStore"
import type { StateFile } from "./statefile.mts"
import { storeToRefs } from "pinia"

/**
 * Get the current state as a state file object. The entire state is deep copied
 * so the returned value (and its children) can be modified freely
 * @return The state file object
 */
export function getState(): StateFile {
    const { objects } = storeToRefs(useGravitySimStore())
    return {
        icon: "./icons/jupiter.svg",
        name: "Test",
        objects: objects.value.map((object) => ({ ...object })),
    }
}

export function setState(state: StateFile): void {
    const { objects } = storeToRefs(useGravitySimStore())
    objects.value = state.objects
}

/**
 * Modify a state file object such that all URL resources are converted to data
 * URLs. The state is modified in-place
 * @param state The state to modify
 */
export async function stateToDataURLs(state: StateFile): Promise<void> {
    state.icon = await toDataURL(state.icon)
    for (const object of state.objects)
        object.icon = await toDataURL(object.icon)
}

/**
 * Modify a state file object such that all URL resources are converted to blob
 * URLs. The state is modified in-place
 * @param state The state to modify
 */
export async function stateToBlobURLs(state: StateFile): Promise<void> {
    state.icon = await toBlobURL(state.icon)
    for (const object of state.objects)
        object.icon = await toBlobURL(object.icon)
}

/**
 * Convert any URL to a data URL
 * @param src The source URL to convert
 * @returns Promise with the data URL
 */
async function toDataURL(src: string): Promise<string> {
    const result = await fetch(src)
    const blob = await result.blob()
    return new Promise(async (resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
    })
}

/**
 * Convert any URL to a blob URL
 * @param src The source URL to convert
 * @returns Promise with the blob URL
 */
async function toBlobURL(src: string): Promise<string> {
    const result = await fetch(src)
    const blob = await result.blob()
    return URL.createObjectURL(blob)
}
