
import Vector2 from "@/util/Vector2"
import { toRef, watch, type MaybeRefOrGetter } from "vue"
import { useTouchInteractor, type TouchInteraction } from "./touchInteractor"

const PINCH_SMOOTHING = 30

/**
 * Callbacks passed to the touch interactor composable
 */
export type TouchInteractorCallbacks = {
    /**
     * Function to call when the user taps with a single finger
     * @param position Position (in pixels) where the user tapped
     */
    tap?: (position: Vector2) => void,
    /**
     * Function to call when the user drags using touch
     * @param diff Difference in movement detected
     * @param position Position (in pixels) where the drag ended. This is the
     * average of all touches in case there are multiple
     */
    drag?: (diff: Vector2, position: Vector2) => void,
    /**
     * Function to call when the user pinches with two or more touch inputs
     * @param ratio Ratio between current distance between fingers and last
     * distance between fingers (> 1 means zoom in, < 1 means zoom out)
     * @param position Average position of the detected touches
     */
    pinch?: (ratio: number, position: Vector2) => void,
}

/**
 * Options passed to the touch interactor composable
 */
export type TouchInteractorOptions = {
    /**
     * Distance that needs to be dragged before detecting a drag instead of a
     * tap (default 0)
     */
    dragThreshold?: number,
}

/**
 * Touch interaction detection with support for tapping, dragging and pinching
 * @param target The target element to detect touch events on
 * @param callbacks Callbacks for different detected events
 * @param options Touch interactor options
 */
export function useTouchDragInteractor(
    target: MaybeRefOrGetter<HTMLElement | null>,
    callbacks?: MaybeRefOrGetter<TouchInteractorCallbacks>,
    options?: MaybeRefOrGetter<TouchInteractorOptions>,
): void {

    // References to callbacks and options
    const callbacksRef = toRef(callbacks)
    const optionsRef = toRef(options)

    // Current screen touches with the correct target
    const { touches } = useTouchInteractor(target)
    watch(touches, update)

    // Total drag movement that hasn't been registered yet
    let movement = Vector2.Zero
    // Whether the drag threshold has been reached
    let thresholdReached = false
    
    function update(newTouches: TouchInteraction[], oldTouches:
    TouchInteraction[]): void {
        if (oldTouches.length == 0 && newTouches.length == 0)
            return
        if (oldTouches.length == 0) {
            start()
            return
        }
        if (newTouches.length == 0) {
            end(oldTouches)
            return
        }
        // NOTE: This may not necessarily trigger move/pinch callback, if
        // there's not enough overlap between touches
        move(newTouches, oldTouches)
        pinch(newTouches, oldTouches)
    }

    function start(): void {
        thresholdReached = false
    }

    function move(newTouches: TouchInteraction[], oldTouches:
    TouchInteraction[]): void {
        const { newOverlap, oldOverlap } = overlappingIDs(newTouches,
            oldTouches)
        if (newOverlap.length == 0 || oldOverlap.length == 0)
            return
        const newPos = averagePosition(newOverlap)
        const oldPos = averagePosition(oldOverlap)
        const diff = newPos.subtract(oldPos)
        movement = movement.add(diff)
        if (movement.length() > (optionsRef.value?.dragThreshold ?? 0))
            thresholdReached = true
        if (!thresholdReached)
            return
        callbacksRef.value?.drag?.(movement, newPos)
        movement = Vector2.Zero
    }

    function end(touches: TouchInteraction[]): void {
        if (!thresholdReached)
            callbacksRef.value?.tap?.(averagePosition(touches))
        movement = Vector2.Zero
    }

    function pinch(newTouches: TouchInteraction[], oldTouches:
    TouchInteraction[]): void {
        const { newOverlap, oldOverlap } = overlappingIDs(newTouches,
            oldTouches)
        if (newOverlap.length < 2 || oldOverlap.length < 2)
            return
        const newDistance = maxTouchDistance(newOverlap) + PINCH_SMOOTHING
        const oldDistance = maxTouchDistance(oldOverlap) + PINCH_SMOOTHING
        const diff = newDistance / oldDistance
        callbacksRef.value?.pinch?.(diff, averagePosition(newTouches))
    }

    function averagePosition(touches: TouchInteraction[]): Vector2 {
        return touches.reduce((cur, touch) => cur.add(touch.position),
        Vector2.Zero).scale(1 / touches.length)
    }

    function overlappingIDs(newTouches: TouchInteraction[], oldTouches:
    TouchInteraction[]): { newOverlap: TouchInteraction[], oldOverlap:
    TouchInteraction[] } {
        const newIDs = new Set(newTouches.map((touch) => touch.identifier))
        const oldIDs = new Set(oldTouches.map((touch) => touch.identifier))
        const filter = (touch: TouchInteraction) =>
            newIDs.has(touch.identifier) && oldIDs.has(touch.identifier)
        return {
            newOverlap: newTouches.filter(filter),
            oldOverlap: oldTouches.filter(filter),
        }
    }

    function maxTouchDistance(touches: TouchInteraction[]): number {
        let max = 0
        for (const first of touches)
            for (const second of touches)
                max = Math.max(max, first.position.distanceTo(second.position))
        return max
    }

}