<script lang="ts" setup>
    import { onMounted, ref, useCssModule, useTemplateRef } from 'vue';
    import MovementTracker from './MovementTracker';
    import Vector2 from '@/util/Vector2';

    // Multiply wheel event distance with this factor to get zoom factor, per
    // delta mode: [DOM_DELTA_PIXEL, DOM_DELTA_LINE, DOM_DELTA_PAGE]
    const ZOOM_WHEEL_SCALE = [2e-3, 1e-4, 2e-6] as const

    const { inertiaDropoff = 3500, noInertia = false } = defineProps<{
        // Whether to disable inertia (default false)
        noInertia?: boolean,
        // Inertia dropoff in px/s^2 (default 3500)
        inertiaDropoff?: number,
    }>()

    // Current position of the interactor, can be changed programmatically of
    // through user interaction
    const position = ref(Vector2.Zero)
    // Current zoom level of the interactor, can also be changed
    // programmatically or through user interaction
    const zoom = ref(0)

    // Main interactor element
    const interactor = useTemplateRef("interactor")
    // Page styling
    const style = useCssModule()

    // Movement tracker object that updates position and zoom correctly
    const tracker = new MovementTracker({
        inertiaDropoff,
        inertia: !noInertia,
    })
    // Update the zoom and position values, which are exposed
    tracker.update.hook(() => {
        zoom.value = tracker.getZoomLevel()
        position.value = tracker.getPosition()
    })

    /**
     * Add user interaction event triggers
     */
    function addUserEvents(): void {
        if (interactor.value == null)
            return
        interactor.value.addEventListener("wheel", onWheel)
        interactor.value.addEventListener("pointerdown", onMouseDown)
    }

    /**
     * Handle a wheel event on the interactor
     * @param event The triggered wheel event
     */
    function onWheel(event: WheelEvent): void {
        const scale = ZOOM_WHEEL_SCALE[event.deltaMode] ?? ZOOM_WHEEL_SCALE[0]
        tracker.zoom(event.deltaY * scale)
    }

    // Whether the map is currently being dragged
    let dragging = false

    /**
     * Handle a mouse down event on the interactor
     * @param event The triggered event
     */
    function onMouseDown(event: MouseEvent): void {
        if (event.button != 0 || dragging)
            return
        dragging = true
        document.addEventListener("pointerup", onMouseUp)
        document.addEventListener("pointercancel", onMouseUp)
        document.addEventListener("mousemove", onMouseMove)
        document.body.classList.add(style["no-user-select"])
    }

    /**
     * Handle a mouse up/mouse cancel event on the document (not the interactor,
     * to support dragging outside of the interactor). Note that should only be
     * triggered after a mouse down event
     * @param _event The triggered event
     */
    function onMouseUp(_event: PointerEvent): void {
        if (!dragging)
            return
        dragging = false
        document.removeEventListener("pointerup", onMouseUp)
        document.removeEventListener("pointercancel", onMouseUp)
        document.removeEventListener("mousemove", onMouseMove)
        document.body.classList.remove(style["no-user-select"])
        tracker.startInertia()
    }

    /**
     * Handle a mouse move event on the document (not the interactor, to support
     * dragging outside of the interactor). Note that should only be triggered
     * after a mouse down event
     * @param event The triggered event
     */
    function onMouseMove(event: MouseEvent): void {
        if (!dragging)
            return
        tracker.pan(new Vector2(event.movementX, event.movementY).negate())
    }

    // Add user events on mount
    onMounted(addUserEvents)

    // Expose relevant values
    defineExpose({ zoom, position })
</script>

<template>
    <div :class="$style.interactor" ref="interactor">
        {{ zoom }}, {{ position }}
    </div>
</template>

<style lang="scss" module>
    .no-user-select {
        user-select: none;
    }

    .interactor {
        width: 600px;
        height: 400px;
        background-color: red;
        user-select: none;
    }
</style>