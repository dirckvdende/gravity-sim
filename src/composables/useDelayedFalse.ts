
import { type Ref, watch, ref, toValue } from "vue";

/**
 * Create a delayed ref that is set to true immediately, but is set to false
 * with a delay. If it set to true within the delay nothing happens
 * @param source Source ref
 * @param delay The delay in milliseconds
 * @returns The delayed ref
 */
export function useDelayedFalse(
    source: Ref<boolean>,
    delay: number,
): Ref<boolean> {
    const target = ref(toValue(source))
    let timeout: number | undefined = undefined
    watch(source, (value, prevValue) => {
        clearTimeout(timeout)
        if (value) {
            target.value = true
            return
        }
        if (value != prevValue) {
            timeout = setTimeout(() => {
                target.value = false
                timeout = undefined
            }, delay)
        }
    }, { immediate: true })
    return target
}