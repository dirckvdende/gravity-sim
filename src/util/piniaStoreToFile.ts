
import { deepOmitUnsafe, deepPickUnsafe } from "deep-pick-omit";
import "pinia"
import type { PiniaPluginContext, StateTree, Store } from "pinia";
import { type Serializer } from "pinia-plugin-persistedstate";

/** Settings used to save a store to files */
export type SaveSettings = {
    /** Files to save the store to */
    files: string[],
    /**
     * Serializer to use to convert to string, defaults to
     * JSON.stringify/JSON.parse
     */
    serializer?: Serializer,
    /** Properties to pick, others are excluded */
    pick?: string[],
    /** Properties to omit, others are included (runs after pick) */
    omit?: string[],
}

declare module "pinia" {
    export interface DefineStoreOptionsBase<S extends StateTree, Store> {
        /** Save the store to files */
        saveToFiles?: SaveSettings,
    }
}

// Array of all file save settings with corresponding store
const saves: (SaveSettings & {store: Store<string, StateTree>})[] = []

export default function piniaPluginStoreToFile(context: PiniaPluginContext) {
    if (!context.options.saveToFiles)
        return
    saves.push({
        ...context.options.saveToFiles,
        store: context.store,
    })
}

function downloadString(content: string, filename: string): void {
    const blob = new Blob([content], { type: "text" })
    const url = URL.createObjectURL(blob)
    const elt = document.createElement("a")
    elt.href = url
    elt.download = filename
    elt.click()
}

export function loadFromString(name: string, content: string): void {
    const data = JSON.parse(content)
    for (const save of saves) {
        if (save.files.indexOf(name) == -1)
            continue
        if (!(save.store.$id in data))
            continue
        const deserializer = save.serializer?.deserialize ?? JSON.parse
        save.store.$state = {
            ...save.store.$state,
            ...deserializer(data[save.store.$id]),
        }
    }
}

function uploadString(callback: (content: string | null) => void, extension:
string = ".txt"): void {
    const inputElement = document.createElement("input")
    inputElement.type = "file"
    inputElement.accept = extension
    inputElement.addEventListener("change", () => {
        if (inputElement.files == null || inputElement.files.length == 0)
            return
        const file = inputElement.files[0]
        if (file == undefined)
            return
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            if (typeof reader.result != "string") {
                callback(null)
                return
            }
            callback(reader.result)
        })
        reader.readAsText(file)
    })
    inputElement.click()
}

/**
 * Download a file with the contents of all stores that have the same filename
 * registered
 * @param name The name of the file in the store settings
 * @param filename Filename to export (default same as name)
 */
export function downloadFile(name: string, filename?: string): void {
    const data: Record<string, string> = {}
    for (const save of saves) {
        if (save.files.indexOf(name) == -1)
            continue
        const serialize = save.serializer?.serialize ?? JSON.stringify
        let state = save.store.$state as StateTree
        if (save.pick != undefined)
            state = deepPickUnsafe(state, save.pick)
        if (save.omit != undefined)
            state = deepOmitUnsafe(state, save.omit)
        data[save.store.$id] = serialize(state)
    }
    downloadString(JSON.stringify(data), filename ?? name)
}

/**
 * Load a file (shows a popup) and store its data in corresponding stores with
 * the same filename registered
 * @param name The filename to load the file to
 * @param extension Filename extension to use (default ".txt")
 * @param callback Function to call once finished, which success parameter
 * @note Loading file happens asynchronously
 */
export function uploadFile(name: string, extension: string = ".txt", callback?:
(success: boolean) => void): void {
    uploadString((content) => {
        if (content == null) {
            callback?.(false)
            return
        }
        loadFromString(name, content)
        callback?.(true)
    }, extension)
}