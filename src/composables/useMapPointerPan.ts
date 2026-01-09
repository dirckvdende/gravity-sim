
import Vector2 from "@/util/linalg/Vector2";
import { toggleCursor, usePointerDrag, type PointerStateOptions } from
"@/composables/useMapPointerDrag";

/** Options for the pointer pan composable */
export type PointerPanOptions = PointerStateOptions & {
    /** Distance in pixels before a panning action is registered (default 5) */
    threshold?: number
}

/**
 * Detect panning using pointer dragging. Uses usePointerDrag to keep track of
 * dragging
 * @param callback Callback for when the user pans. Parameter has the difference
 * panned
 * @param options Options to pass, has options of usePointerDrag and a threshold
 * for dragging
 */
export function usePointerPan(callback: (diff: Vector2) => void,
options?: PointerPanOptions): void {
    let diff = Vector2.Zero
    let distance = 0
    usePointerDrag((state) => {
        if (state.length == 0) {
            toggleCursor(null)
            diff = Vector2.Zero
            distance = 0
            return
        }
        const t = state.length
        for (const pointer of state) {
            const cur = new Vector2(-pointer.moveX / t, -pointer.moveY / t)
            diff = diff.add(cur)
            distance += cur.length()
        }
        if (distance >= (options?.threshold ?? 5)) {
            toggleCursor(options?.cursor === undefined ? "move" :
            options.cursor)
            callback(diff)
            diff = Vector2.Zero
        }
    }, {
        ...options,
        cursor: null,
    })
}