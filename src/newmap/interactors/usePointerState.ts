
import { useElementBounding, usePointer } from "@vueuse/core"
import { computed, reactive, ref, toValue, watch, type Ref,
type UnwrapNestedRefs } from "vue"

/** Pointer state with currently pressed pointer */
type PointerState = UnwrapNestedRefs<ReturnType<typeof usePointer>>
/** Options to pass to the pointer state tracker */
type PointerStateOptions = Parameters<typeof usePointer>[0]

/**
 * Detects updates to pointer state, with support for multiple pointers. Wrapper
 * around vueuse's usePointer. Only tracks pressed pointers. Keeps tracking
 * pressed pointers that have moved outside the target element
 * @param options Options to pass to usePointer
 * @returns Currently pressed pointers with their data
 */
export function usePointerState(options?: PointerStateOptions):
Ref<PointerState[]> {
    const tracked = ref<PointerState[]>([])
    const targetElement = computed(() => {
        const value = toValue(options?.target)
        if (!(value instanceof HTMLElement))
            return document.documentElement
        return value
    })
    const { x: offsetX, y: offsetY } = useElementBounding(targetElement)

    function hasId(id: number): boolean {
        return tracked.value.find(({ pointerId }) => pointerId == id) !=
            undefined
    }

    function add(state: PointerState): void {
        if (hasId(state.pointerId))
            return
        tracked.value = [...tracked.value, { ...state }]
    }

    function removeId(id: number): void {
        if (!hasId(id))
            return
        tracked.value = tracked.value.filter(({ pointerId }) => pointerId != id)
    }

    function update(state: PointerState): void {
        if (!hasId(state.pointerId))
            return
        removeId(state.pointerId)
        add(state)
    }

    // Watch target element for drag start. This is only used to detect drag
    // starts and not movements
    watch(reactive(usePointer(options)), (value) => {
        if (value.pressure == 0)
            removeId(value.pointerId)
        else
            add(value)
    })

    // Watch document element for tracked pointer movement and removal
    watch(reactive(usePointer({...options, target: undefined})), (value) => {
        if (value.pressure == 0)
            removeId(value.pointerId)
        update({
            ...value,
            x: value.x - offsetX.value,
            y: value.y - offsetY.value,
        })
    })

    return tracked
}