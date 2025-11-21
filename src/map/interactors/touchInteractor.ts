
import Vector2 from "@/util/Vector2";
import { toRef, type MaybeRefOrGetter } from "vue";
import { useEventListener } from "./eventListener";

type TouchInteraction = {
    identifier: number,
    position: Vector2,
}

export function useTouchInteractor(
    target: MaybeRefOrGetter<HTMLElement | null>,
    updateCallback: (newTouches: TouchInteraction[], oldTouches:
    TouchInteraction[]) => void,
): void {

    // Ref to the target element
    const targetRef = toRef(target)

    // IDs of touches that were started on the target element
    const tracked: Set<number> = new Set()
    let lastTouches: TouchInteraction[] = []

    function touchstart(event: TouchEvent): void {
        addTargetTouches(event)
    }
    
    function update(event: TouchEvent, target: HTMLElement): void {
        removeUnusedTouches(event)
        const oldTouches = lastTouches
        lastTouches = getTouches(event)
        if (lastTouches.length == 0 && oldTouches.length == 0)
            return
        updateCallback(lastTouches, oldTouches)
    }
    
    function addTargetTouches(event: TouchEvent): void {
        for (const touch of event.targetTouches)
            tracked.add(touch.identifier)
    }

    function removeUnusedTouches(event: TouchEvent): void {
        const currentIDs = new Set(Array.from(event.touches).map((touch) =>
            touch.identifier))
        for (const id of Array.from(tracked))
            if (!currentIDs.has(id))
                tracked.delete(id)
    }

    function getTouches(event: TouchEvent):
    TouchInteraction[] {
        const touches = Array.from(event.touches).filter((touch) =>
            tracked.has(touch.identifier))
        return touches.map((touch) => ({
            identifier: touch.identifier,
            position: touchPosition(touch),
        }))
    }

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

}