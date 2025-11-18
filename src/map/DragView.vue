<script lang="ts">
    /**
     * Component that can be interacted with by the user to pan or zoom in a 2D
     * space. The component keeps track of current position and zoom level and
     * emits these values though an "update" event
     */
    export default {}

    /**
     * Type that stores the current state of the drag view. It also has some
     * useful auxiliary functions for rendering calculations. This is the type
     * that is returned by the "update" event. This type is not used by the
     * component internally
     */
    export class DragViewState {

        // Position of the center of the drag view
        position: Vector2
        // Zoom level of the drag view
        zoomLevel: number
        // Dimensions of the drag view viewport in pixels
        dimensions: Vector2

        /**
         * Constructor
         * @param position Position of the drag view
         * @param zoomLevel Zoom level of the drag view
         * @param dimensions Dimensions of the drag view viewport in pixels
         */
        constructor(position: Vector2, zoomLevel: number, dimensions: Vector2) {
            this.position = position
            this.zoomLevel = zoomLevel
            this.dimensions = dimensions
        }

        /**
         * The viewport of the view, with top left and bottom right coordinates
         * in view units
         */
        get viewport(): { topLeft: Vector2, bottomRight: Vector2 } {
            const unitDims = this.dimensions.scale(.5 * this.pixelSize)
            return {
                topLeft: this.position.subtract(unitDims),
                bottomRight: this.position.add(unitDims),
            }
        }

        /**
         * Size of a pixel in view units
         */
        get pixelSize(): number {
            return Math.exp(-this.zoomLevel)
        }

        /**
         * Convert coordinates in view units to pixel coordinates
         * @param coords The view unit coordinates to convert
         * @returns The pixel coordinates
         */
        toPixelCoords(coords: Vector2): Vector2 {
            return coords.subtract(this.viewport.topLeft)
                .scale(1 / this.pixelSize)
        }

    }
</script>

<script setup lang="ts">
    import Vector2 from '@/util/Vector2';
    import DragTarget from './DragTarget.vue';
    import { onMounted, useTemplateRef, type DeepReadonly, watch } from 'vue';

    const emit = defineEmits<{
        /**
         * Update event is triggered when the state of the draw view changes,
         * and once when the component is mounted (then it's called with the
         * initial state)
         */
        (e: "update", state: DragViewState): void,
    }>()

    // Current position of the center of the view
    let position = Vector2.Zero
    // Current zoom level
    let zoomLevel = 0

    // Drag target component
    const target = useTemplateRef("target")

    /**
     * Get the current state of the view
     * @returns The DragViewState object with the current state
     */
    function getState(): DragViewState {
        const dimensions = new Vector2(
            target.value?.container?.clientWidth ?? 0,
            target.value?.container?.clientHeight ?? 0,
        )
        return new DragViewState(position, zoomLevel, dimensions)
    }

    /**
     * Update current state to shift position
     * @param diff The difference in position
     */
    function pan(diff: Vector2): void {
        if (diff.isZero())
            return
        position = position.add(diff)
        emit("update", getState())
    }

    /**
     * Update current state to zoom in or out
     * @param diff The difference in zoom level
     */
    function zoom(diff: number): void {
        if (diff == 0)
            return
        zoomLevel += diff
        emit("update", getState())
    }

    // Observer used to detect size changes of the drag view, which triggers an
    // update
    const resizeObserver = new ResizeObserver(() => emit("update", getState()))

    onMounted(() => {
        // Emit update when component is first mounted
        emit("update", getState())
        // Add container to observed elements. Emit an update when container is
        // resized
        if (!target.value?.container)
            throw new Error("Couldn't load drag target container element")
        resizeObserver.observe(target.value?.container)
    })
</script>

<template>
    <DragTarget @pan="pan" @zoom="zoom" ref="target">
        <slot />
    </DragTarget>
</template>