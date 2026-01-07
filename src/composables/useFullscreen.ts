
import { unrefElement, useMounted, type MaybeElementRef } from "@vueuse/core";
import { watch, onMounted, onUnmounted, ref, type Ref } from "vue";

/**
 * Options for the useFullscreen composable, same as options to JS's
 * requestFullscreen
 */
export type UseFullscreenOptions = FullscreenOptions

/** Return type of the useFullscreen composable */
export type UseFullscreenReturn = Ref<boolean>

/**
 * Variation on the useFullscreen VueUse composable, except the return value is
 * just a ref to a boolean, which can be modified to toggle fullscreen mode
 * @param target Target element for fullscreen
 * @param options Options to be passed on requestFullscreen
 * @returns A ref to a boolean indicating if fullscreen mode is active, which
 * can be both read and written to. Ref is only updated as long as component is
 * mounted
 */
export function useFullscreen(
    target?: MaybeElementRef,
    options?: UseFullscreenOptions,
): UseFullscreenReturn {
    const isFullscreen = ref(false)
    const mounted = useMounted()

    watch(isFullscreen, (value) => {
        if (!mounted.value)
            return
        if (value) {
            const targetElement = unrefElement(target) ??
                document.documentElement
            if (targetElement)
                targetElement.requestFullscreen(options)
            else
                isFullscreen.value = false
        } else if (document.fullscreenElement != null) {
            document.exitFullscreen()
        }
    })

    /** Update the isFullscreen ref without triggering watcher */
    function update(): void {
        isFullscreen.value = document.fullscreenElement != null
    }

    onMounted(() => {
        addEventListener("load", update)
        addEventListener("fullscreenchange", update)
        update()
    })

    onUnmounted(() => {
        removeEventListener("load", update)
        removeEventListener("fullscreenchange", update)
    })

    return isFullscreen
}