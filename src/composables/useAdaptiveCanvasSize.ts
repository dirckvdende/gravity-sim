
import { useDevicePixelRatio, useElementSize } from "@vueuse/core";
import { computed, toRef, watch, type ComputedRef, type MaybeRefOrGetter,
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
    width: ComputedRef<number>
    height: ComputedRef<number>
} {
    canvas = toRef(canvas)
    const { width: eltWidth, height: eltHeight } = useElementSize(canvas)
    const { pixelRatio } = useDevicePixelRatio()
    const width = computed(() => eltWidth.value * pixelRatio.value)
    const height = computed(() => eltHeight.value * pixelRatio.value)
    const watchHandle = watch([canvas, width, height], ([canvas, width,
    height])=> {
        if (!canvas)
            return
        canvas.width = width
        canvas.height = height
    }, { immediate: true })
    return { watchHandle, width, height }
}