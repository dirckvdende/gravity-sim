
import { type MaybeRefOrGetter, toRef, watch, onMounted, onUnmounted } from
"vue";

// Multiply wheel event distance with this factor to get zoom factor, per
// delta mode: [DOM_DELTA_PIXEL, DOM_DELTA_LINE, DOM_DELTA_PAGE]
const ZOOM_WHEEL_SCALE = [1, 0.05, 0.001] as const

/**
 * Object with callbacks that can be passed to the zoom interactor
 */
type ZoomInteractorCallbacks = {
    /**
     * Function to call when the user zooms in or out, with the difference in
     * zoom level it added
     * @param diff Difference in zoom level
     */
    zoom?: (diff: number) => void,
}

/**
 * Object with options that can be passed to the zoom interactor
 */
type ZoomInteractorOptions = {
    /**
     * Prevent the default scrolling behaviour on the target element (default
     * true)
     */
    preventDefault?: boolean,
}

export function useZoomInteractor(
    target: MaybeRefOrGetter<HTMLElement | null>,
    callbacks?: MaybeRefOrGetter<ZoomInteractorCallbacks>,
    options?: MaybeRefOrGetter<ZoomInteractorOptions>,
): void {

    // Regs to input arguments
    const targetRef = toRef(target)
    const callbacksRef = toRef(callbacks)
    const optionsRef = toRef(options)

    /**
     * Handle wheel event on the target element. This prevents normal scroll
     * behaviour by default
     * @param event Triggered event
     */
    function wheel(event: WheelEvent): void {
        if (optionsRef.value?.preventDefault !== false)
            event.preventDefault()
        const scale = ZOOM_WHEEL_SCALE[event.deltaMode] ?? ZOOM_WHEEL_SCALE[0]
        const diff = -event.deltaY * scale
        callbacksRef.value?.zoom?.(diff)
    }

    /**
     * Handle a change in target element by adding/removing event listeners
     * @param newTarget The new target element
     * @param oldTarget The old target element
     */
    function updateTargetEvents(newTarget: HTMLElement | null, oldTarget:
    HTMLElement | null): void {
        oldTarget?.removeEventListener("wheel", wheel)
        newTarget?.addEventListener("wheel", wheel)
    }

    watch(targetRef, updateTargetEvents)
    onMounted(() => updateTargetEvents(targetRef.value, null))
    onUnmounted(() => updateTargetEvents(null, targetRef.value))

}