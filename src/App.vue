<script setup lang="ts">
    import { useTemplateRef } from 'vue';
    import { useDragInteractor } from './map/dragInteractor';
    import { usePositionRectTracker } from './map/positionRectTracker';
    import GridRenderer from './map/GridRenderer.vue';
    import { useZoomInteractor } from './map/zoomInteractor';

    const target = useTemplateRef("target")
    const tracker = usePositionRectTracker(target)
    const { pan, zoom, toUnitCoords } = tracker
    useDragInteractor(target, { drag: pan })
    useZoomInteractor(target, { zoom: (diff, position) => {
        zoom(diff / 1000, toUnitCoords(position))
    }})
</script>

<template>
    <div :class="$style.target" ref="target">
        <GridRenderer :tracker="tracker" />
    </div>
</template>

<style lang="scss" module>
    .target {
        position: relative;
        background-color: red;
        width: 50%;
        height: 300px;
        overflow: hidden;
    }

    .test {
        position: absolute;
        width: 100px;
        height: 100px;
        background-color: black;
    }
</style>
