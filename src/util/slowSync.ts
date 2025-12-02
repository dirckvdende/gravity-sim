
import { watch, type Ref } from "vue";

/**
 * Sync the value of a source reference to a target reference, with a given
 * minimum time between updates. If this time hasn't been reached yet, dst will
 * be updated after the time has elapsed
 * @param src Source reference
 * @param dst Destination reference, to place the values of the source in
 * @param minInterval Minimum interval between updates in ms
 * @returns Function to call to stop the syncing
 */
export function useSyncRefSlow<T>(src: Ref<T>, dst: Ref<T>, minInterval:
number): () => void {
    let lastUpdate = 0
    let planned: number | null = null

    function updateDst(): void {
        lastUpdate = performance.now()
        planned = null
        dst.value = src.value
    }

    const unwatch = watch(src, () => {
        if (planned != null)
            return
        const now = performance.now()
        const diff = now - lastUpdate
        if (diff < minInterval) {
            const timeLeft = minInterval - diff
            planned = setTimeout(updateDst, timeLeft)
        } else {
            lastUpdate = now
            updateDst()
        }
    })

    function stop(): void {
        unwatch()
        if (planned != null)
            clearTimeout(planned)
    }

    return stop
}