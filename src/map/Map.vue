<script setup lang="ts">
    import { useTemplateRef } from 'vue';
    import { useDragInteractor } from './dragInteractor';
    import { usePositionRectTracker } from './positionRectTracker';
    import GridRenderer from './GridRenderer.vue';
    import { useZoomInteractor } from './zoomInteractor';
    import IconRenderer from './icons/IconRenderer.vue';
    import Vector2 from '@/util/Vector2';

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
        <IconRenderer :tracker="tracker" :icons="[{
            src: 'https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png',
            position: Vector2.Zero,
            size: 100,
        }]" />
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
    }

    .test {
        position: absolute;
        width: 100px;
        height: 100px;
        background-color: black;
    }
</style>
