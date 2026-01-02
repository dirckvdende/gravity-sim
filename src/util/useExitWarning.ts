
import { onMounted, onUnmounted } from "vue"

/**
 * Display a warning in the browser when the user exits the page or refreshes
 * @returns An object with a function stop, to stop the browser from displaying
 * a warning after the function is called
 */
export function useExitWarning(): {
    stop: () => void
} {
    let stopped = false
    let listener: null | ((event: BeforeUnloadEvent) => void) = null

    /** Bind the window event listener */
    function bind(): void {
        if (stopped)
            return
        listener = (event) => event.preventDefault()
        window.addEventListener("beforeunload", listener)
    }

    /** Unbind the window event listener */
    function unbind(): void {
        if (!listener)
            return
        window.removeEventListener("beforeunload", listener)
        listener = null
    }

    /** Stop displaying the browser warning */
    function stop(): void {
        stopped = true
        unbind()
    }

    onMounted(bind)
    onUnmounted(unbind)

    return { stop }
}