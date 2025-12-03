
import { ref, type Ref, computed, type ComputedRef, type MaybeRefOrGetter,
onMounted, toRef, onUnmounted, watch } from "vue"
import Vector2 from "@/util/Vector2"
import { usePositionTracker } from "./positionTracker"

/**
 * Return type when creating a position rect tracker
 */
export type PositionRectTracker = {
    /**
     * Ref to the current position of the tracker
     */
    position: Ref<Vector2>,
    /**
     * Ref to the current zoom level of the tracker
     */
    zoomLevel: Ref<number>,
    /**
     * Number of units that every screen pixel is large
     */
    pixelSize: ComputedRef<number>,
    /**
     * Dimensions of the target element in pixels
     */
    dimensions: Readonly<Ref<Vector2>>,
    /**
     * Viewport coordinates of top-left and bottom-right corners, where zoom
     * level and position are taken into account
     */
    viewport: ComputedRef<{
        topLeft: Vector2,
        bottomRight: Vector2,
    }>
    /**
     * Pan the position tracker by the given difference
     * @param diff Difference in position, which will be scaled using the zoom
     * level
     */
    pan: (diff: Vector2) => void,
    /**
     * Update the zoom level of the tracker
     * @param diff Difference in zoom level to apply
     * @param center The coordinates to zoom in to, in unit coordinates
     */
    zoom: (diff: number, center?: Vector2) => void,
    /**
     * Convert unit coordinates to pixel coordinates
     * @param coords Unit coordinates
     * @returns Pixel coordinates
     */
    toPixelCoords: (coords: Vector2) => Vector2,
    /**
     * Convert pixel coordinates to unit coordinates
     * @param coords Pixel coordinates
     * @returns Unit coordinates
     */
    toUnitCoords: (coords: Vector2) => Vector2,
}

export function usePositionRectTracker(
    target: MaybeRefOrGetter<HTMLElement | null>,
): PositionRectTracker {

    // Keeps track of position, without taking target element into account
    const { position, zoomLevel, pan, zoom: centerZoom, pixelSize } =
    usePositionTracker()
    // Size of the target element in pixels
    const dimensions = useElementSize(target)
    // Viewport with top left and bottom right coordinates, where units take
    // zoom level and position into account
    const viewport = computed(() => {
        const unitDims = dimensions.value.scale(.5 * pixelSize.value)
        return {
            topLeft: position.value.subtract(unitDims),
            bottomRight: position.value.add(unitDims),
        }
    })

    /**
     * Convert unit coordinates to pixel coordinates
     * @param coords Unit coordinates
     * @returns Pixel coordinates
     */
    function toPixelCoords(coords: Vector2): Vector2 {
        // (coords - topLeft) / pixelSize
        return coords.subtract(viewport.value.topLeft).scale(1 /
        pixelSize.value)
    }

    /**
     * Convert pixel coordinates to unit coordinates
     * @param coords Pixel coordinates
     * @returns Unit coordinates
     */
    function toUnitCoords(coords: Vector2): Vector2 {
        // coords * pixelSize + topLeft
        return coords.scale(pixelSize.value).add(viewport.value.topLeft)
    }

    /**
     * Update the zoom level of the tracker
     * @param diff Difference in zoom level to apply
     * @param center The coordinates to zoom in to, in unit coordinates
     */
    function zoom(diff: number, center?: Vector2): void {
        if (center == undefined) {
            centerZoom(diff)
            return
        }
        const centerDiff = center.subtract(position.value).scale(1 /
        pixelSize.value)
        pan(centerDiff)
        centerZoom(diff)
        pan(centerDiff.scale(-1))
    }

    return { position, zoomLevel, pan, zoom, pixelSize, dimensions, viewport,
    toPixelCoords, toUnitCoords }
}

/**
 * Track the size of an HTML element (clientWidth, clientHeight)
 * @param target The target element to track the size of
 * @returns A reference to the size of the target element
 */
function useElementSize(
    target: MaybeRefOrGetter<HTMLElement | null>,
): Readonly<Ref<Vector2>> {

    // Target object reference
    const targetRef = toRef(target)
    // Size of the target ref, or a zero vector if target is null
    const size = ref(Vector2.Zero)

    // Observer that updates the returned ref when size of target changes
    const resizeObserver = new ResizeObserver(updateSize)
    
    /**
     * Update the size ref value, as a result of an element resize or updated
     * target
    */
   function updateSize(): void {
        if (targetRef.value == null) {
            size.value = Vector2.Zero
            return
        }
        size.value = new Vector2(
            targetRef.value.clientWidth,
            targetRef.value.clientHeight,
        )
    }

    /**
     * Update the tracked target
     * @param newTarget The new target to track
     * @param oldTarget The old target to track
     */
    function updateTarget(newTarget: HTMLElement | null, oldTarget: HTMLElement
    | null): void {
        if (oldTarget != null)
            resizeObserver.unobserve(oldTarget)
        if (newTarget != null)
            resizeObserver.observe(newTarget)
        updateSize()
    }

    watch(targetRef, updateTarget)
    onMounted(() => updateTarget(targetRef.value, null))
    onUnmounted(() => updateTarget(null, targetRef.value))

    return size
}