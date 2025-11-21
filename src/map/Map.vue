<script setup lang="ts">
    import { useTemplateRef, computed } from 'vue';
    import { useDragInteractor } from './dragInteractor';
    import { usePositionRectTracker } from './positionRectTracker';
    import GridRenderer from './GridRenderer.vue';
    import { useZoomInteractor } from './zoomInteractor';
    import IconRenderer from './icons/IconRenderer.vue';
    import Vector2 from '@/util/Vector2';
    import { useGravitySim } from './gravitySim';

    const target = useTemplateRef("target")
    const tracker = usePositionRectTracker(target)
    const { pan, zoom, toUnitCoords } = tracker
    // Zoom out a lot
    zoom(-13)
    useDragInteractor(target, { drag: pan })
    useZoomInteractor(target, { zoom: (diff, position) => {
        zoom(diff / 1000, toUnitCoords(position))
    }})

    const { objects } = useGravitySim({
        // 1/120 of a day
        stepSize: 720,
    })

    objects.value.push({
        icon: './icons/earth.svg',
        position: new Vector2(-4_670_000, 0),
        size: 12_742_000,
        mass: 5.972e24,
        velocity: new Vector2(0, -12.40),
    })

    objects.value.push({
        icon: './icons/moon.svg',
        position: new Vector2(384_784_000, 0),
        size: 3_474_800,
        mass: 7.34767309e22,
        velocity: new Vector2(0, 1_022),
    })

    const icons = computed(() => objects.value.map((object) => ({
        src: object.icon,
        position: object.position,
        size: object.size,
    })))
</script>

<template>
    <div :class="$style.target" ref="target">
        <!-- <GridRenderer :tracker="tracker" /> -->
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
    }

    .test {
        position: absolute;
        width: 100px;
        height: 100px;
        background-color: black;
    }
</style>
