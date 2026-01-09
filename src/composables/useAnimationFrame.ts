
import { onMounted, onUnmounted } from "vue"

/**
 * Call a function every animation frame
 * @param callback Callback to call every animation frame, as long as component
 * is mounted
 */
export function useAnimationFrame(callback: () => void): void {
    let animationStopped = false
    const animationCallback = () => {
        if (animationStopped)
            return
        callback()
        requestAnimationFrame(animationCallback)
    }
    onMounted(() => requestAnimationFrame(animationCallback))
    onUnmounted(() => animationStopped = true)
}