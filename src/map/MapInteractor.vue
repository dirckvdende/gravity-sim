<script lang="ts" setup>
    import { onMounted, ref, useCssModule, useTemplateRef, watch } from 'vue';
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
    // Emitted update when position and/or zoom level changes
    const emit = defineEmits<{
        (e: "update", viewport: [Vector2, Vector2]): void,
    }>()

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
        emit("update", viewport())
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

    function toPixelCoords(coords: Vector2): Vector2 {
        if (interactor.value == null)
            throw new Error("Cannot find coords because HTML element is not "
            + "found")
        const canvasSize = new Vector2(interactor.value.clientWidth,
        interactor.value.clientHeight)
        return tracker.toPixelCoords(canvasSize, coords)
    }

    function viewport(): [Vector2, Vector2] {
        if (interactor.value == null)
            throw new Error("Cannot find coords because HTML element is not "
            + "found")
        const canvasSize = new Vector2(interactor.value.clientWidth,
        interactor.value.clientHeight)
        return tracker.viewport(canvasSize)
    }

    // Add user events on mount
    onMounted(addUserEvents)

    // Expose relevant values
    defineExpose({ zoom, position, toPixelCoords, viewport })

    const lines = ref<Vector2[]>([])
    watch(position, (value) => {
        lines.value = []
        for (let x = -(value.x % 100) - 200; x < -(value.x % 100) + 2599;
        x += 100)
            lines.value.push(new Vector2(x, 0))
    }, { immediate: true })

    const hlines = ref<Vector2[]>([])
    watch(position, (value) => {
        hlines.value = []
        for (let y = -(value.y % 100) - 200; y < -(value.y % 100) + 2599;
        y += 100)
            hlines.value.push(new Vector2(0, y))
    }, { immediate: true })
</script>

<template>
    <div :class="$style.interactor" ref="interactor">
        <div v-for="line in lines" :style="{
            left: `${line.x}px`,
            top: `${line.y}px`,
            width: '2px',
            height: '1000px',
            backgroundColor: 'black',
            position: 'absolute',
        }"></div>
        <div v-for="line in hlines" :style="{
            left: `${line.x}px`,
            top: `${line.y}px`,
            width: '2000px',
            height: '2px',
            backgroundColor: 'black',
            position: 'absolute',
        }"></div>
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
        position: relative;
        overflow: hidden;
    }
</style>