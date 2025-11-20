
import Vector2 from "@/util/Vector2";
import { type Ref, ref, type ComputedRef, computed } from "vue";

/**
 * Returns type when creating a position tracker
 */
export type PositionTracker = {
    /**
     * Ref to the current position of the tracker
     */
    position: Readonly<Ref<Vector2>>,
    /**
     * Ref to the current zoom level of the tracker
     */
    zoomLevel: Readonly<Ref<number>>,
    /**
     * Number of units that every screen pixel is large
     */
    pixelSize: ComputedRef<number>,
    /**
     * Pan the position tracker by the given difference
     * @param diff Difference in position, which will be scaled using the zoom
     * level
     */
    pan: (diff: Vector2) => void,
    /**
     * Update the zoom level of the tracker
     * @param diff Difference in zoom level to apply
     */
    zoom: (diff: number) => void,
}

/**
 * Composable that tracks a position and zoom level based on pan and zoom
 * instructions. The pan instructions take the current zoom level into account
 * (so these are scales when zoom level != 0)
 * @returns References to the position and zoom level of the position tracker,
 * and functions that can be called to pan/zoom
 */
export function usePositionTracker(): PositionTracker {

    // Current position and zoom level
    const position = ref(Vector2.Zero)
    const zoomLevel = ref(0)
    // Size in units of a single pixel, given the current zoom level
    const pixelSize = computed(() => Math.exp(-zoomLevel.value))

    /**
     * Update the position with the given difference
     * @param diff Difference in position to apply
     */
    function pan(diff: Vector2): void {
        position.value = position.value.add(diff.scale(pixelSize.value))
    }

    /**
     * Update the zoom level with the given difference. A positive value means
     * zooming in, a negative value zooming out
     * @param diff Difference in zoom to apply
     */
    function zoom(diff: number): void {
        zoomLevel.value += diff
    }

    return { position, zoomLevel, pan, zoom, pixelSize }

}