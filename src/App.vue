<script setup lang="ts">
    import { useTemplateRef } from 'vue';
    import { useDragInteractor } from './map/dragInteractor';
    import { usePositionRectTracker } from './map/positionRectTracker';
    import GridRenderer from './map/GridRenderer.vue';

    const target = useTemplateRef("target")
    const tracker = usePositionRectTracker(target)
    const { pan } = tracker
    useDragInteractor(target, {
        drag: pan,
    })
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
