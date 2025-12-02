import { ref } from "vue"

/**
 * Check if window is in fullscreen mode
 * @returns A boolean indicating if window is in fullscreen mode
 */
export function isFullscreen(): boolean {
    return document.fullscreenElement != null
}

/** Ref to the current fullscreen status */
export const isFullscreenRef = ref(false)

function updateFullscreenRef(): void {
    isFullscreenRef.value = isFullscreen()
}

addEventListener("load", updateFullscreenRef)
addEventListener("fullscreenchange", updateFullscreenRef)

/**
 * Toggle fullscreen mode
 * @param force Force fullscreen on or of (optional)
 */
export function toggleFullscreen(force?: boolean): void {
    force ??= !isFullscreen()
    if (force)
        document.documentElement.requestFullscreen({ navigationUI: "hide" })
    else
        document.exitFullscreen()
}