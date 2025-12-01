
import Vector2 from "@/util/Vector2";
import { type InjectionKey, type Ref } from "vue";

/** State of a map with center position, zoom level, etc. */
export type MapState = {
    /** HTML element that the map uses to render */
    target: HTMLElement | null
    /** Position of the center of the displayed map */
    position: Vector2
    /** Zoom level on an logarithmic scale */
    zoomLevel: number
    /** Size of the target element in pixels */
    targetSize: Vector2
}

/** Key used for inject-provide in map component */
export const mapStateKey = Symbol() as InjectionKey<Ref<MapState>>

/**
 * Get the viewport (in map coords) of a map
 * @param state The map state to get the viewport of
 * @returns The viewport with topLeft and bottomRight coords
 */
export function viewport(state: MapState): {
    topLeft: Vector2
    bottomRight: Vector2
} {
    const scale = pixelSize(state)
    return {
        topLeft: state.position.subtract(state.targetSize.scale(scale / 2)),
        bottomRight: state.position.add(state.targetSize.scale(scale / 2)),
    }
}

/**
 * Get the pixel size of a map
 * @param state The state to get the pixel size of
 * @return The size of a single pixel in map coords
 */
export function pixelSize(state: MapState): number {
    return Math.exp(-state.zoomLevel)
}

/**
 * Convert pixel coords to map coords
 * @param state The map state to use for the conversion
 * @param pixelCoords Pixel coords to convert
 * @returns The map coords
 */
export function toMapCoords(state: MapState, pixelCoords: Vector2): Vector2 {
    const { topLeft } = viewport(state)
    return new Vector2(topLeft).add(pixelCoords.scale(pixelSize(state)))
}

/**
 * Convert map coords to pixel coords
 * @param state The map state to use for the conversion
 * @param mapCoords Map coords to convert
 * @returns The pixel coords
 */
export function toPixelCoords(state: MapState, mapCoords: Vector2): Vector2 {
    return mapCoords.subtract(viewport(state).topLeft).scale(1 /
        pixelSize(state))
}

/**
 * Modify a map state such that it is shifted by a given amount of pixels
 * @param state The map state to modify
 * @param diff Pixel coord difference
 */
export function panPixels(state: MapState, diff: Vector2): void {
    state.position = state.position.add(diff.scale(pixelSize(state)))
}

/**
 * Modify a map state to zoom in/out
 * @param state The map state to modify
 * @param diff Difference in zoom level to apply (positive = zoom in, negative =
 * zoom out)
 * @param at Position to zoom into, in map coords (default center of viewport)
 */
export function zoom(state: MapState, diff: number, at?: Vector2): void {
    const shift = (at ?? state.position).subtract(state.position)
    const scaleFactor = Math.exp(-diff)
    state.zoomLevel += diff
    state.position = state.position.add(shift.scale(1 - scaleFactor))
}