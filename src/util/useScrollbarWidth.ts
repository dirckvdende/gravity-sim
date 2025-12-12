
import { onMounted, onUnmounted, ref, toRef, toValue, watch,
type MaybeRefOrGetter, type Ref } from "vue";

/**
 * Width of the scrollbar of an element
 * @param target Target element to track scrollbar width of
 * @returns Readonly ref to the width
 */
export function useScrollbarWidth(target: MaybeRefOrGetter<HTMLElement | null>):
Readonly<Ref<number>> {
    // Ref to the scrollbar width
    const width = ref(0)

    /**
     * Update the width ref to the current value
     */
    function updateWidth(): void {
        const targetValue = toValue(target)
        if (targetValue == null) {
            width.value = 0
            return
        }
        width.value = targetValue.offsetWidth - targetValue.clientWidth
    }

    // Observer used for updating width ref
    const observer = new ResizeObserver(updateWidth)

    /**
     * Update the observer target element
     * @param newTarget New target element for the observer
     * @param oldTarget Old target element for the observer
     */
    function updateObserver(newTarget: HTMLElement | null, oldTarget:
    HTMLElement | null): void {
        if (oldTarget != null)
            observer.unobserve(oldTarget)
        if (newTarget != null)
            observer.observe(newTarget)
    }

    watch(toRef(target), updateObserver)
    onMounted(() => updateObserver(toValue(target), null))
    onUnmounted(() => {
        updateObserver(null, toValue(target))
        observer.disconnect()
    })

    return width
}