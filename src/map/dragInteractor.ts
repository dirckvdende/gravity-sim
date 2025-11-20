
import { watch, type MaybeRefOrGetter, onMounted, onUnmounted, toRef } from
"vue";
import Vector2 from "@/util/Vector2";

/**
 * Get the mouse position within a target element
 * @param target The target HTML element
 * @returns The mouse position in pixels
 */
function mousePosition(target: HTMLElement, event: MouseEvent): Vector2 {
    const targetRect = target.getBoundingClientRect()
    const mousePos = new Vector2(event.clientX, event.clientY)
    const targetPos = new Vector2(targetRect.left, targetRect.top)
    return mousePos.subtract(targetPos)
}

/**
 * Toggle the mouse cursor for the entire document
 * @param cursor Cursor name (CSS) or null to revert to default
 */
function toggleCursor(cursor: string | null): void {
    if (cursor == null) {
        document.documentElement.attributeStyleMap.delete("cursor")
        return
    }
    document.documentElement.attributeStyleMap.set("cursor", cursor)
}

/**
 * Object with callbacks that can be passed to the drag interactor
 */
type DragInteractorCallbacks = {
    /**
     * Function to call when the user clicks on the target without dragging
     * @param position The pixel coordinates relative to the target the click
     * occurred in
     */
    click?: (position: Vector2) => void,
    /**
     * Function to call when dragging. This function is called any time the
     * mouse moves, not just at the end of dragging
     * @param diff Difference in movement detected
     * @param position The pixels cordinates of the mouse, relative to the
     * target element
     */
    drag?: (diff: Vector2, position: Vector2) => void,
}

/**
 * Object with options that can be passed to the drag interactor
 */
type DragInteractorOptions = {
    /**
     * Minimum distance before detecting a drag instead of a click
     */
    dragThreshold?: number,
}

/**
 * Add drag interactions to an HTML element
 * @param target Target element of the drag interactions
 * @param callbacks Functions to call when specific events are detected
 * @param options Options for drag detection
 */
export function useDragInteractor(
    target: MaybeRefOrGetter<HTMLElement | null>,
    callbacks?: MaybeRefOrGetter<DragInteractorCallbacks>,
    options?: MaybeRefOrGetter<DragInteractorOptions>,
): void {

    // Refs to input arguments
    const targetRef = toRef(target)
    const callbacksRef = toRef(callbacks)
    const optionsRef = toRef(options)

    // Whether the user is currently dragging
    let dragging = false
    // Whether significant movement has been detected yet
    let reachedThreshold = false
    // Stored movement (in case drag threshold hasn't been reached)
    let movement = Vector2.Zero

    /**
     * Handle pointerdown event on the target object. Initializes dragging/
     * clicking detection
     * @param event Pointerdown event that triggered the drag start
     */
    function pointerdown(event: PointerEvent): void {
        if (event.button != 0 || dragging)
            return
        dragging = true
        reachedThreshold = false
        toggleDragEvents(true)
    }

    /**
     * Either add or remove the event listeners on the document used to detect
     * dragging
     * @param value If true, add the event listeners, other remove them
     */
    function toggleDragEvents(value: boolean): void {
        const method = value ? document.addEventListener :
        document.removeEventListener
        method("pointerup", pointerup)
        method("pointercancel", pointerup)
        method("mousemove", mousemove)
    }

    /**
     * Handle pointerup and pointercancel events anywhere on the document. This
     * should only be called while dragging
     * @param event Triggered event
     */
    function pointerup(event: PointerEvent): void {
        if (!dragging)
            return
        dragging = false
        toggleDragEvents(false)
        if (targetRef.value && !reachedThreshold && callbacksRef.value?.click)
            callbacksRef.value.click(mousePosition(targetRef.value, event))
        toggleCursor(null)
    }

    /**
     * Handle mousemove event anywhere on the document. This should only be
     * called while dragging
     * @param event Triggered event
     */
    function mousemove(event: MouseEvent): void {
        if (!dragging || targetRef.value == null)
            return
        const mouseMove = new Vector2(event.movementX, event.movementY)
        const diff = updateMovement(mouseMove.scale(-1))
        if (diff.isZero())
            return
        if (callbacksRef.value?.drag)
            callbacksRef.value.drag(diff, mousePosition(targetRef.value, event))
        toggleCursor("grab")
    }

    /**
     * Update the currently detected movement and whether this passes the
     * threshold
     * @param diff Cursor movement difference
     * @returns The movement difference that should be passed to the user. If
     * this is zero no movement should be passed
     */
    function updateMovement(diff: Vector2): Vector2 {
        movement = movement.add(diff)
        if (movement.length() >= (optionsRef.value?.dragThreshold ?? 0))
            reachedThreshold = true
        if (reachedThreshold) {
            const move = movement
            movement = Vector2.Zero
            return move
        }
        return Vector2.Zero
    }

    /**
     * Handle a change in target element by adding/removing event listeners
     * @param newTarget The new target element
     * @param oldTarget The old target element
     */
    function updateTargetEvents(newTarget: HTMLElement | null, oldTarget:
    HTMLElement | null): void {
        oldTarget?.removeEventListener("pointerdown", pointerdown)
        newTarget?.addEventListener("pointerdown", pointerdown)
    }

    watch(targetRef, updateTargetEvents)
    onMounted(() => updateTargetEvents(targetRef.value, null))
    onUnmounted(() => updateTargetEvents(null, targetRef.value))

}