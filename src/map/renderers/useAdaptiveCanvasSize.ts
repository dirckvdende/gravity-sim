
import { useDevicePixelRatio, useElementSize, useEventListener } from "@vueuse/core";
import { toRef, watch, type MaybeRefOrGetter, type WatchHandle } from "vue";

/**
 * Adapt the width and height attributes of a canvas to its displayed (device
 * pixels) size. When this composable changes the canvas size, it saved the
 * canvas contents before resizing, and pastes it back after. This way the
 * canvas will not be cleared on resize
 * @param canvas The canvas to adapt size for
 * @param callback Function to call after the canvas size has changed, with the
 * width and height as arguments
 * @returns Watch handles to pause/stop the adaptive canvas sizing
 */
export function useAdaptiveCanvasSize(canvas: MaybeRefOrGetter<
HTMLCanvasElement | null>, callback?: (width: number, height: number) => void):
WatchHandle {
    canvas = toRef(canvas)
    const { width, height } = useElementSize(canvas)
    const { pixelRatio } = useDevicePixelRatio()
    return watch([canvas, width, height, pixelRatio], ([canvas, width, height,
    pixelRatio]) => {
        if (!canvas)
            return
        canvas.width = width * pixelRatio
        canvas.height = height * pixelRatio
        callback?.(width, height)
    }, { immediate: true })
}