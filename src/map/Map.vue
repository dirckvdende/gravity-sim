<script setup lang="ts">
    import { useTemplateRef } from 'vue';
    import { useDragInteractor } from './interactors/dragInteractor';
    import { usePositionRectTracker } from './positionRectTracker';
    import { useZoomInteractor } from './interactors/zoomInteractor';

    const target = useTemplateRef("target")
    const tracker = usePositionRectTracker(target)
    const { pan, zoom, toUnitCoords } = tracker
    // Zoom out a lot
    zoom(-13)
    useDragInteractor(target, { drag: pan })
    useZoomInteractor(target, { zoom: (diff, position) => {
        zoom(diff / 1000, toUnitCoords(position))
    }})
</script>

<template>
    <div :class="$style.target" ref="target">
        <slot :tracker="tracker" />
    </div>
</template>

<style lang="scss" module>
    .target {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--background-color, white);
        overflow: hidden;
        touch-action: none;
        user-select: none;
    }
</style>
