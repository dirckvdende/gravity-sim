
import { useEventListener } from "@vueuse/core"

/**
 * Display a warning in the browser when the user exits the page or refreshes
 * @returns An object with a function stop, to stop the browser from displaying
 * a warning after the function is called
 */
export function useExitWarning(): {
    stop: () => void
} {
    const stop = useEventListener("beforeunload", (event) =>
        event.preventDefault())
    return { stop }
}