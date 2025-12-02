
import { usePointer } from "@vueuse/core"
import { watch } from "vue"
import { usePointerState } from "./usePointerState"

/** Options to pass to the pointer drag tracker */
type PointerStateOptions = Parameters<typeof usePointer>[0]
/** Pointer dragging state with difference in position and pointer ID */
type PointerDragState = {
    moveX: number,
    moveY: number,
    pointerId: number,
}

/**
 * Detect pointer dragging. Uses usePointerState to keep track of dragging
 * @param callback Callback for when dragging has changed. Parameter contains a
 * list of all pressed pointers with their movement
 * @param options Options to pass, same as options of vueuse's usePointer
 */
export function usePointerDrag(callback: (state: PointerDragState[]) => void,
options?: PointerStateOptions): void {
    watch(usePointerState(options), (newState, oldState) => {
        const state: PointerDragState[] = []
        for (const oldPointer of oldState) {
            for (const newPointer of newState) {
                if (newPointer.pointerId != oldPointer.pointerId)
                    continue
                state.push({
                    moveX: newPointer.x - oldPointer.x,
                    moveY: newPointer.y - oldPointer.y,
                    pointerId: newPointer.pointerId,
                })
                break
            }
        }
        callback(state)
    })
}