
import Vector2 from "@/util/Vector2";
import { ref, toRef, type MaybeRefOrGetter, type Ref } from "vue";
import { useEventListener } from "./eventListener";

/**
 * An single touch interaction. For example a finger held on the screen
 */
export type TouchInteraction = {
    identifier: number,
    position: Vector2,
}

/**
 * Detect touch interactions on an HTML element, passing the current touch
 * points to a callback function
 * @param target The target element to track interactions on
 * @returns Ref to array of current touch interactions
 */
export function useTouchInteractor(
    target: MaybeRefOrGetter<HTMLElement | null>,
): { touches: Ref<TouchInteraction[]> } {

    // Ref to the target element
    const targetRef = toRef(target)
    // Ref to array of current touch interactions
    const touches = ref<TouchInteraction[]>([])

    // IDs of touches that were started on the target element
    const tracked: Set<number> = new Set()

    /**
     * Called when the user starts touching the target element
     * @param event The triggered touch event
     */
    function touchstart(event: TouchEvent): void {
        addTargetTouches(event)
    }
    
    /**
     * Called when the user performs any touch action (start/move/end/cancel) on
     * the document (not just the target element)
     * @param event The triggered touch event
     */
    function update(event: TouchEvent): void {
        removeUnusedTouches(event)
        const newTouches = getTouches(event)
        if (newTouches.length == 0 && touches.value.length == 0)
            return
        touches.value = newTouches
    }
    
    /**
     * Add touch IDs of the touches that are targeting the same element as the
     * event target to the tracked touches
     * @param event The triggered event
     */
    function addTargetTouches(event: TouchEvent): void {
        for (const touch of event.targetTouches)
            tracked.add(touch.identifier)
    }

    /**
     * Remove touch IDs from tracked touches that are not present in the given
     * event
     * @param event The triggered event
     */
    function removeUnusedTouches(event: TouchEvent): void {
        const currentIDs = new Set(Array.from(event.touches).map((touch) =>
            touch.identifier))
        for (const id of Array.from(tracked))
            if (!currentIDs.has(id))
                tracked.delete(id)
    }

    /**
     * Get the IDs and positions of all tracked touches
     * @param event The event to read touches from
     * @returns List of objects with ID and position
     */
    function getTouches(event: TouchEvent): TouchInteraction[] {
        const touches = Array.from(event.touches).filter((touch) =>
            tracked.has(touch.identifier))
        return touches.map((touch) => ({
            identifier: touch.identifier,
            position: touchPosition(touch),
        }))
    }

    /**
     * Get the position of a touch event touch, relative to the target element
     * @param touch The touch event touch
     * @returns THe position as a vector
     */
    function touchPosition(touch: Touch): Vector2 {
        const rect = targetRef.value?.getBoundingClientRect() ?? new DOMRect()
        const topLeft = new Vector2(rect.left, rect.top)
        const clientPos = new Vector2(touch.clientX, touch.clientY)
        return clientPos.subtract(topLeft)
    }

    useEventListener(target, "touchstart", touchstart)
    useEventListener(document.documentElement, "touchstart", update)
    useEventListener(document.documentElement, "touchmove", update)
    useEventListener(document.documentElement, "touchend", update)
    useEventListener(document.documentElement, "touchcancel", update)

    return { touches }

}