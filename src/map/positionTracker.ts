
import Vector2 from "@/util/Vector2";
import { type MaybeRefOrGetter, toRef, type Ref, ref } from "vue";

export function usePositionTracker(): {
    position: Ref<Vector2>,
    zoomLevel: Ref<number>,
    pan: (diff: Vector2) => void,
    zoom: (diff: number) => void,
} {

    // Current position and zoom level
    const position = ref(Vector2.Zero)
    const zoomLevel = ref(0)

    /**
     * Update the position with the given difference
     * @param diff Difference in position to apply
     */
    function pan(diff: Vector2): void {
        position.value = position.value.add(diff.scale(pixelSize()))
    }

    /**
     * Update the zoom level with the given difference. A positive value means
     * zooming in, a negative value zooming out
     * @param diff Difference in zoom to apply
     */
    function zoom(diff: number): void {
        zoomLevel.value += diff
    }

    /**
     * Get the scale to apply when panning
     * @returns Number of units to pan for every pixel
     */
    function pixelSize(): number {
        return Math.exp(-zoomLevel.value)
    }

    return { position, zoomLevel, pan, zoom }

}