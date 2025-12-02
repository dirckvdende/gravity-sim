
import { useEventListener } from "@vueuse/core";
import type { MaybeRefOrGetter } from "vue";

/** Scroll wheel event with position and scroll difference */
type ScrollWheelEvent = {
    /** X coord of the wheel event relative to target */
    x: number
    /** Y coord of the wheel event relative to target */
    y: number
    /** Scrolling delta (in y direction) */
    delta: number
    /** Delta mode of the scrolling event */
    deltaMode: 0 | 1 | 2
}

/**
 * Execute a function when a scroll wheel is used on an element
 * @param target The target element to detect scroll wheel interactions on
 * @param callback Callback with as parameter the amount of pixels scrolled and
 * the position where scrolling happened
 */
export function useScrollWheel(target: MaybeRefOrGetter<HTMLElement | null>,
callback: (event: ScrollWheelEvent) => void): void {
    useEventListener(target, "wheel", (event) => {
        if (event.ctrlKey)
            return
        callback({
            x: event.offsetX,
            y: event.offsetY,
            delta: event.deltaY,
            deltaMode: [0, 1, 2].indexOf(event.deltaMode) != -1
                ? (event.deltaMode as 0 | 1 | 2) : 0,
        })
    })
}