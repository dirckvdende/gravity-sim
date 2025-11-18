<script lang="ts">
    /**
     * Component that registers user dragging and scrolling interactions as pans
     * and zooms. Note that this object only emits the detected pans and zooms.
     * It does not keep track of a current position of zoom level
     */
    export default {}
</script>

<script setup lang="ts">
    import Vector2 from '@/util/Vector2';
    import { watch } from 'vue';

    // Multiply wheel event distance with this factor to get zoom factor, per
    // delta mode: [DOM_DELTA_PIXEL, DOM_DELTA_LINE, DOM_DELTA_PAGE]
    const ZOOM_WHEEL_SCALE = [1, .05, .001] as const

    const {
        disablePan = false,
        disableZoom = false,
        panScale = 1,
        zoomScale = 1,
    } = defineProps<{
        /**
         * Disables panning interactions (dragging)
         */
        disablePan?: boolean,
        /**
         * Disables zoom interactions (scrolling)
         */
        disableZoom?: boolean,
        /**
         * Scale used for padding. Number of moved pixels will correspond with
         * this number of units
         */
        panScale?: number,
        /**
         * Scale used for zoom. Number of pixels scrolled will correspond with
         * this number of units
         */
        zoomScale?: number,
    }>()

    const emit = defineEmits<{
        /**
         * Event emitted when the user pans
         * @param diff The scaled panning difference detected
         */
        (e: "pan", diff: Vector2): void,
        /**
         * Event emitted when the user zooms (scrolls)
         * @param diff The difference in zoom level, negative means zooming out,
         * positive is zooming in
         */
        (e: "zoom", diff: number): void,
    }>()

    // Whether the user is currently dragging
    let dragging = false

    /**
     * Triggered when the user starts dragging
     * @param event Triggered pointer event
     */
    function dragStart(event: PointerEvent): void {
        if (event.button != 0 || dragging || disablePan)
            return
        dragging = true
        document.addEventListener("pointerup", dragEnd)
        document.addEventListener("pointercancel", dragEnd)
        document.addEventListener("mousemove", mouseMove)
        document.documentElement.attributeStyleMap.set("cursor", "grab")
    }

    /**
     * Triggered when the user stops dragging
     */
    function dragEnd(): void {
        dragging = false
        document.removeEventListener("pointerup", dragEnd)
        document.removeEventListener("pointercancel", dragEnd)
        document.removeEventListener("mousemove", mouseMove)
        document.documentElement.attributeStyleMap.delete("cursor")
    }

    /**
     * Triggered when the user moves the mouse and is currently dragging
     * @param event Triggered mouse event
     */
    function mouseMove(event: MouseEvent): void {
        if (!dragging)
            return
        const movement = new Vector2(event.movementX, event.movementY)
        emit("pan", movement.scale(-panScale))
    }

    /**
     * Triggered when the user zooms (scrolls)
     * @param event Triggered wheel event
     */
    function zoom(event: WheelEvent): void {
        if (disableZoom)
            return
        const scale = ZOOM_WHEEL_SCALE[event.deltaMode] ?? ZOOM_WHEEL_SCALE[0]
        emit("zoom", -scale * zoomScale * event.deltaY)
    }

    // Watch the disablePan prop to stop panning as soon as it is set to true
    watch(() => disablePan, (value) => {
        if (!value || !dragging)
            return
        dragEnd()
    })
</script>

<template>
    <div @pointerdown="dragStart" @wheel="zoom">
        <slot />
    </div>
</template>