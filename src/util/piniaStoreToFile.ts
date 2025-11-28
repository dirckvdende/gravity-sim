
import { deepOmitUnsafe, deepPick, deepPickUnsafe } from "deep-pick-omit";
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

function downloadString(content: string): void {
    const blob = new Blob([content], { type: "text" })
    const url = URL.createObjectURL(blob)
    const elt = document.createElement("a")
    elt.href = url
    elt.download = ""
    elt.click()
}

/**
 * Download a file with the contents of all stores that have the same filename
 * registered
 * @param name The name of the file
 */
export function downloadFile(name: string): void {
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
    downloadString(JSON.stringify(data))
}

/**
 * Load a file (shows a popup) and store its data in corresponding stores with
 * the same filename registered
 * @param name The filename to load the file to
 */
export function loadFile(name: string): void {
    // TODO
}