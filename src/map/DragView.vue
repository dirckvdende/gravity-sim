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
    class DragViewState {

        // Position of the drag view
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

    }
</script>

<script setup lang="ts">
    import Vector2 from '@/util/Vector2';
    import DragTarget from './DragTarget.vue';
    import { onMounted, useTemplateRef, type DeepReadonly } from 'vue';

    const emit = defineEmits<{
        /**
         * Update event is triggered when the state of the draw view changes,
         * and once when the component is mounted (then it's called with the
         * initial state)
         */
        (e: "update", state: DeepReadonly<DragViewState>): void,
    }>()

    // Current position of the center of the view
    let position = Vector2.Zero
    // Current zoom level
    let zoomLevel = 0

    // Emit update when component is first mounted
    onMounted(() => emit("update", getState()))

    const target = useTemplateRef("target")

    function getState(): DragViewState {
        // TODO
        const dimensions = new Vector2(target.value?.innerWidth)
        return new DragViewState(position, zoomLevel, dimensions)
    }

    function pan(diff: Vector2): void {
        if (diff.isZero())
            return
        position = position.add(diff)
        emit("update", state)
    }

    function zoom(diff: number): void {
        if (diff == 0)
            return
        state.zoomLevel += diff
        emit("update", state)
    }
</script>

<template>
    <DragTarget @pan="pan" @zoom="zoom" ref="target">
        <slot />
    </DragTarget>
</template>