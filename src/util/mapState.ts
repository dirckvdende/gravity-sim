
import Vector2 from "@/util/linalg/Vector2";
import Vector3 from "@/util/linalg/Vector3";
import { computed, type ComputedRef, type Ref, ref } from "vue";

/** State of a map with center position, zoom level, etc. */
export type MapStateBase = {
    /** HTML element that the map uses to render */
    target: Ref<HTMLElement | null>
    /** Position of the center of the displayed map */
    position: Ref<Vector2>
    /** Zoom level on an logarithmic scale */
    zoomLevel: Ref<number>
    /** Size of the target element in pixels */
    targetSize: ComputedRef<Vector2>
    /**
     * Inverse focal length for 3D view, a value of 0 is an orthogonal
     * projection. The focal length is relative to the width of the screen (in
     * map units)
     */
    inverseFocalLength: Ref<number>
}

/**
 * State of a map with center position, zoom level, etc., and computed
 * properties
 */
export type MapState = MapStateBase & {
    /** The size of a single pixel in map coords */
    pixelSize: ComputedRef<number>
    /**
     * Viewport (in map coords) of the map with top left and bottom right coords
     */
    viewport: ComputedRef<{
        topLeft: Vector2
        bottomRight: Vector2
    }>
    /**
     * Convert pixel coords to map coords
     * @param pixelCoords Pixel coords to convert
     * @returns The map coords
     */
    toMapCoords(pixelCoords: Vector2): Vector2
    /**
     * Convert map coords to pixel coords
     * @param mapCoords Map coords to convert
     * @returns The pixel coords
     */
    toPixelCoords(mapCoords: Vector2): Vector2
    /**
     * Convert map coords to pixel coords, taking camera depth into account.
     * Returns null if the coords are behind the camera
     * @param mapCoords Map coords to convert
     * @returns The pixel coords
     */
    toPixelCoords3D(mapCoords: Vector3): Vector2 | null
    /**
     * Modify map state such that it is shifted by a given amount of pixels
     * @param diff Pixel coord difference
     */
    panPixels(diff: Vector2): void
    /**
     * Modify map state to zoom in/out
     * @param diff Difference in zoom level to apply (positive = zoom in,
     * negative = zoom out)
     * @param at Position to zoom into, in map coords (default center of
     * viewport)
     */
    zoom(diff: number, at?: Vector2): void
    /**
     * Modify map state to zoom in/out given some ratio pixelSizeAfter /
     * pixelSizeBefore
     * @param ratio The ratio between the pixel size before and after
     * @param at Position to zoom into, in map coords (default center of
     * viewport)
     */
    zoomRatio(ratio: number, at?: Vector2): void
}

/**
 * Default value to use for map state inject(). Returns a new object such that
 * no modifications bleed over
 * @returns A new map state with default values
 */
export function defaultState(): MapState {
    return extendMapState({
        target: ref<HTMLElement | null>(null),
        position: ref(Vector2.Zero),
        zoomLevel: ref(0),
        targetSize: computed(() => Vector2.Zero),
        inverseFocalLength: ref(0),
    })
}

/**
 * Extends a base map state with computed refs and helper functions
 * @param base Base map state to extend with computed refs and functions
 * @returns The extended map state
 */
export function extendMapState(base: MapStateBase): MapState {

    const { position, targetSize, zoomLevel, inverseFocalLength } = base

    const pixelSize = computed(() => {
        return Math.exp(-zoomLevel.value)
    })

    const viewport = computed(() => ({
        topLeft: position.value.subtract(targetSize.value.scale(
            pixelSize.value / 2)),
        bottomRight: position.value.add(targetSize.value.scale(
            pixelSize.value / 2)),
    }))

    function toMapCoords(pixelCoords: Vector2): Vector2 {
        const { topLeft } = viewport.value
        return new Vector2(topLeft).add(pixelCoords.scale(pixelSize.value))
    }

    function toPixelCoords(mapCoords: Vector2): Vector2 {
        return new Vector2(
            (mapCoords.x - viewport.value.topLeft.x) / pixelSize.value,
            (mapCoords.y - viewport.value.topLeft.y) / pixelSize.value,
        )
    }

    function toPixelCoords3D(mapCoords: Vector3): Vector2 | null {
        const width = viewport.value.bottomRight.x - viewport.value.topLeft.x
        const focal = inverseFocalLength.value / width
        // Negative z -> further away
        const scale = 1 + focal * -mapCoords.z
        if (scale <= 0)
            return null
        console.log(scale)
        return toPixelCoords(mapCoords
            .flatten()
            .subtract(position.value)
            .scale(1 / scale)
            .add(position.value))
    }

    function panPixels(diff: Vector2): void {
        position.value = position.value.add(diff.scale(pixelSize.value))
    }

    function zoom(diff: number, at?: Vector2): void {
        const shift = (at ?? position.value).subtract(position.value)
        const scaleFactor = Math.exp(-diff)
        zoomLevel.value += diff
        position.value = position.value.add(shift.scale(1 - scaleFactor))
    }

    function zoomRatio(ratio: number, at?: Vector2): void {
        zoom(Math.log(ratio), at)
    }

    return {
        ...base,
        pixelSize,
        viewport,
        toMapCoords,
        toPixelCoords,
        toPixelCoords3D,
        panPixels,
        zoom,
        zoomRatio,
    }
}