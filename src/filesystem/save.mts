
import { serializeState } from "./serialize.mts";
import { stateToDataURLs } from "./state.mts";
import { type StateFile } from "./statefile.mts";

export async function saveToFile(state: StateFile): Promise<void> {
    await stateToDataURLs(state)
    const serializedState = serializeState(state)
    const escapedFilename = state.name.replace(/[^a-z0-9_\-]/gi, "_")
        .toLowerCase()
    downloadString(serializedState, "text/plain", `${escapedFilename}.grav`)
}

function downloadString(content: string, mimeType: string = "text/plain",
filename: string = "download.txt"): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.download = filename
    a.href = url
    a.click()
}