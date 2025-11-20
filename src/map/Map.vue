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
    useDragInteractor(target, { drag: pan })
    useZoomInteractor(target, { zoom: (diff, position) => {
        zoom(diff / 1000, toUnitCoords(position))
    }})

    const { objects } = useGravitySim()

    objects.value.push({
        icon: './public/icons/earth.svg',
        position: Vector2.Zero,
        size: 100,
        mass: 1,
        velocity: new Vector2(0, -200),
    })

    objects.value.push({
        icon: './public/icons/earth.svg',
        position: new Vector2(400, 0),
        size: 100,
        mass: 1,
        velocity: new Vector2(0, 200),
    })

    const icons = computed(() => objects.value.map((object) => ({
        src: object.icon,
        position: object.position,
        size: object.size,
    })))
</script>

<template>
    <div :class="$style.target" ref="target">
        <GridRenderer :tracker="tracker" />
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
