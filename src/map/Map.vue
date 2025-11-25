<script setup lang="ts">
    import { useTemplateRef } from 'vue';
    import { useDragInteractor } from './interactors/dragInteractor';
    import { usePositionRectTracker } from './positionRectTracker';
    import GridRenderer from './GridRenderer.vue';
    import { useZoomInteractor } from './interactors/zoomInteractor';
    import IconRenderer, { type RenderedIcon } from './icons/IconRenderer.vue';
    import Vector2 from '@/util/Vector2';
    import PathRenderer from './PathRenderer.vue';

    const {
        icons,
        paths = [],
    } = defineProps<{
        /** Icons to display on the map */
        icons: RenderedIcon[],
        /** Paths to display on the map, each as an array of points */
        paths?: Vector2[][],
    }>()

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
        <GridRenderer :tracker="tracker" />
        <PathRenderer v-for="path in paths" :tracker="tracker" :points="path" />
        <IconRenderer :tracker="tracker" :icons="icons" />
    </div>
</template>

<style lang="scss" module>
    .target {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: white;
        overflow: hidden;
        touch-action: none;
    }

    .test {
        position: absolute;
        width: 100px;
        height: 100px;
        background-color: black;
    }
</style>
