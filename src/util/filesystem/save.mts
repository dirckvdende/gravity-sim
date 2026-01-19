
import { deserializeState, serializeState } from "./serialize.mts";
import { stateToBlobURLs, stateToDataURLs } from "./state.mts";
import { type StateFile } from "./statefile.mts";
import { uploadString } from "@/util/uploadString";

/**
 * Download a state file as serialized JSON
 * @param state The state file to download
 */
export async function saveToFile(state: StateFile): Promise<void> {
    await stateToDataURLs(state)
    const serializedState = serializeState(state)
    const escapedFilename = state.name.replace(/[^a-z0-9_\-]/gi, "_")
        .toLowerCase()
    downloadString(serializedState, "text/plain", `${escapedFilename}.grav`)
}

/**
 * Load a state file by prompting the user to upload a file
 * @returns A promise with the loaded state file object. The file object will
 * have blob URLs for all resources
 */
export async function loadFromFile(): Promise<StateFile> {
    const { content } = await uploadString(".grav")
    return await loadFromString(content)
}

/**
 * Load a state file by reading a string
 * @param content The string to load from
 * @returns A promise with the loaded state object. The file object will
 * have blob URLs for all resources
 */
export async function loadFromString(content: string): Promise<StateFile> {
    const state = deserializeState(content)
    await stateToBlobURLs(state)
    return state
}

/**
 * Load a state from a URL pointing to a JSON file
 * @param url The URL to load the state from
 * @returns A promise with the loaded state file object. The file object will
 * have blob URLs for all resources
 */
export async function loadFromURL(url: string): Promise<StateFile> {
    const response = await fetch(url)
    const content = await response.text()
    const state = deserializeState(content)
    await stateToBlobURLs(state)
    return state
}

/**
 * Download a string as a file
 * @param content The contents of the file to download
 * @param mimeType The MIME type of the file (default "text/plain")
 * @param filename Default filename (default "download.txt")
 */
function downloadString(content: string, mimeType: string = "text/plain",
filename: string = "download.txt"): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.download = filename
    a.href = url
    a.click()
}