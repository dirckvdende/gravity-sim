
import { useGravitySimStore } from "@/stores/useGravitySimStore"
import type { StateFile } from "./statefile.mts"
import { storeToRefs } from "pinia"
import { usePropertiesStore } from "@/stores/usePropertiesStore"
import { useGravityMapStore } from "@/stores/useGravityMapStore"
import { useMenuStore } from "@/stores/useMenuStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { useOrbitsStore } from "@/stores/useOrbitsStore"

/**
 * Get the current state as a state file object. The entire state is deep copied
 * so the returned value (and its children) can be modified freely
 * @return The state file object
 */
export function getState(): StateFile {
    const { objects, timestamp } = useGravitySimStore()
    const { icon, name } = usePropertiesStore()
    const { position, zoomLevel } = useGravityMapStore()
    const { speed } = useSettingsStore()
    return {
        icon, name, position, zoomLevel, timestamp, speed,
        objects: objects.map((object) => ({ ...object })),
    }
} 

/**
 * Set the current state from a state file object
 * @param state The state file object to set the state from. May be partial to
 * support older file versions
 */
export function setState(state: Partial<StateFile>): void {
    const { objects, timestamp } = storeToRefs(useGravitySimStore())
    const { icon, name } = storeToRefs(usePropertiesStore())
    const { position, zoomLevel } = storeToRefs(useGravityMapStore())
    const { speed } = storeToRefs(useSettingsStore())
    objects.value = state.objects ?? objects.value
    icon.value = state.icon ?? icon.value
    name.value = state.name ?? name.value
    position.value = state.position ?? position.value
    zoomLevel.value = state.zoomLevel ?? zoomLevel.value
    timestamp.value = state.timestamp ?? new Date(Date.now())
    speed.value = state.speed ?? speed.value
    cleanupForStateLoad()
}

/**
 * Clean up anything from previously loaded state, such as displayed orbits and
 * opened menus. Also pauses the sim
 */
function cleanupForStateLoad(): void {
    const { activeMenu } = storeToRefs(useMenuStore())
    useOrbitsStore().clear()
    activeMenu.value = "none"
    const { paused } = storeToRefs(useSettingsStore())
    paused.value = true
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
