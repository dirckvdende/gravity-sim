
import { deserializeState, serializeState } from "./serialize.mts";
import { stateToBlobURLs, stateToDataURLs } from "./state.mts";
import { type StateFile } from "./statefile.mts";

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
    const content = await uploadString(".grav")
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

/**
 * Prompt the user to upload a file and get its contents
 * @param extension Filename extension that can be uploaded (default ".txt")
 * @returns A promise to a string with the file contents
 */
async function uploadString(extension?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const inputElement = document.createElement("input")
        inputElement.type = "file"
        inputElement.accept = extension ?? ".txt"
        inputElement.addEventListener("change", () => {
            if (inputElement.files == null || inputElement.files.length == 0)
                return
            const file = inputElement.files[0]
            if (file == undefined)
                return
            const reader = new FileReader()
            reader.addEventListener("load", () => {
                if (typeof reader.result != "string") {
                    reject("Reader result is not a string")
                    return
                }
                resolve(reader.result)
            })
            reader.readAsText(file)
        })
        inputElement.click()
    })
}