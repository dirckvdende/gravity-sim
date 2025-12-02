
import { usePointer } from "@vueuse/core"
import { watch } from "vue"
import { usePointerState } from "./usePointerState"

/** Amount to add to both old and new pinch size when calculating ratio */
const SMOOTHING_FACTOR = 2

/** Options to pass to the pointer pinch tracker */
type PointerStateOptions = Parameters<typeof usePointer>[0]
/** Pointer pinch state with center position of the pinch and amount of pinch */
type PointerPinchState = {
    /** X coord of the center of the pinch (center of pointers) */
    x: number,
    /** Y coord of the center of the pinch (center of pointers) */
    y: number,
    /** Size change of the pinch, as a ratio sizeAfter / sizeBefore */
    ratio: number,
}
type PointerState = ReturnType<typeof usePointerState>["value"][number]

/**
 * Detect pinching. Uses usePointerState to keep track of pinches
 * @param callback Callback for when dragging has changed. Parameter contains a
 * list of all pressed pointers with their movement
 * @param options Options to pass, same as options of vueuse's usePointer
 */
export function usePointerPinch(callback: (state: PointerPinchState) => void,
options?: PointerStateOptions): void {
    watch(usePointerState(options), (newState, oldState) => {
        const overlap = overlappingIds(newState, oldState)
        if (overlap.length < 2)
            return
        const overlapFilter = ({ pointerId }: PointerState) =>
            overlap.indexOf(pointerId) != -1
        const filteredNew = newState.filter(overlapFilter)
        const newMax = maxDistance(filteredNew)
        const oldMax = maxDistance(oldState.filter(overlapFilter))
        callback({
            ...averagePos(filteredNew),
            ratio: (newMax + SMOOTHING_FACTOR) / (oldMax + SMOOTHING_FACTOR),
        })
    })
}

function distance(pointerA: PointerState, pointerB: PointerState): number {
    return Math.sqrt(
        Math.pow(pointerA.x - pointerB.x, 2) +
        Math.pow(pointerA.y - pointerB.y, 2)
    )
}

function maxDistance(state: PointerState[]): number {
    let mx = 0
    for (const pointerA of state)
        for (const pointerB of state)
            mx = Math.max(mx, distance(pointerA, pointerB))
    return mx
}

function overlappingIds(stateA: PointerState[], stateB: PointerState[]):
number[] {
    return stateA.filter(({ pointerId: idA }) =>
        stateB.find(({ pointerId }) => idA == pointerId)
    ).map(({ pointerId }) => pointerId)
}

function averagePos(state: PointerState[]): { x: number, y: number } {
    let x = 0, y = 0
    for (const pointer of state) {
        x += pointer.x
        y += pointer.y
    }
    return { x: x / state.length, y: y / state.length }
}