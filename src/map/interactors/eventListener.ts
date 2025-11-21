
import { onMounted, onUnmounted, toRef, watch, type MaybeRefOrGetter } from
"vue";

/**
 * Call a function when an event is triggered on a given HTML element
 * @param target Target element or a ref to one
 * @param name Name of the event
 * @param callback Function to call when event is triggered. Arguments are the
 * event triggered and the target element (which is not null)
 */
export function useEventListener<K extends keyof HTMLElementEventMap>(
    target: MaybeRefOrGetter<HTMLElement | null>,
    name: K,
    callback: (event: HTMLElementEventMap[K], target: HTMLElement) => void,
): void {

    // Target element ref
    const targetRef = toRef(target)
    // Wrapper for the callback function that supplies it with the target
    // element
    const callbackWrapper = (event: HTMLElementEventMap[K]): void => {
        if (targetRef.value == null)
            return
        callback(event, targetRef.value)
    }

    /**
     * Update the target element by adding/removing event listeners
     * @param newTarget The new target element
     * @param oldTarget THe old target element
     */
    function updateTarget(newTarget: HTMLElement | null, oldTarget: HTMLElement
    | null): void {
        oldTarget?.removeEventListener(name, callbackWrapper)
        newTarget?.addEventListener(name, callbackWrapper)
    }

    watch(targetRef, updateTarget)
    onMounted(() => updateTarget(targetRef.value, null))
    onUnmounted(() => updateTarget(null, targetRef.value))

}