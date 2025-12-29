
import { useDevicePixelRatio, useElementSize } from "@vueuse/core";
import { toRef, watch, type MaybeRefOrGetter, type ShallowRef,
type WatchHandle } from "vue";

/**
 * Adapt the width and height attributes of a canvas to its displayed (device
 * pixels) size. When this composable changes the canvas size, it saved the
 * canvas contents before resizing, and pastes it back after. This way the
 * canvas will not be cleared on resize
 * @param canvas The canvas to adapt size for
 * @returns Watch handles to pause/stop the adaptive canvas sizing, and refs to
 * the width and height of the canvas
 */
export function useAdaptiveCanvasSize(canvas: MaybeRefOrGetter<
HTMLCanvasElement | null>): {
    watchHandle: WatchHandle
    width: Readonly<ShallowRef<number>>
    height: Readonly<ShallowRef<number>>
} {
    canvas = toRef(canvas)
    const { width, height } = useElementSize(canvas)
    const { pixelRatio } = useDevicePixelRatio()
    const watchHandle = watch([canvas, width, height, pixelRatio], ([canvas,
    width, height, pixelRatio]) => {
        if (!canvas)
            return
        canvas.width = width * pixelRatio
        canvas.height = height * pixelRatio
    }, { immediate: true })
    return { watchHandle, width, height }
}