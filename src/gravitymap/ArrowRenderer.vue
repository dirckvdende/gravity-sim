<script setup lang="ts">
    import { defaultState, mapStateKey } from '@/map/state';
    import Vector2 from '@/util/linalg/Vector2';
    import { computed, inject } from 'vue';

    const { start, end } = defineProps<{
        /** Coordinates of the start of the arrow */
        start: Vector2
        /** Coordinates of the tip of the arrow */
        end: Vector2
    }>()

    const HANDLE_ANGLE = Math.PI * 0.22
    const HANDLE_LENGTH = 10

    const { toPixelCoords } = inject(mapStateKey, defaultState())
    const startCoords = computed(() => toPixelCoords(start))
    const endCoords = computed(() => toPixelCoords(end))
    const angle = computed(() => {
        const diff = endCoords.value.subtract(startCoords.value)
        return (diff.isZero() ? 0 : diff.angle()) + Math.PI
    })
    const leftHandleCoords = computed(() => {
        return endCoords.value.add(
            new Vector2(HANDLE_LENGTH, 0).rotate(angle.value - HANDLE_ANGLE))
    })
    const rightHandleCoords = computed(() => {
        return endCoords.value.add(
            new Vector2(HANDLE_LENGTH, 0).rotate(angle.value + HANDLE_ANGLE))
    })
</script>

<template>
    <svg :class="$style.svg">
        <line
            :class="$style.line"
            :x1="startCoords.x"
            :y1="startCoords.y"
            :x2="endCoords.x"
            :y2="endCoords.y" />
        <line
            :class="$style.line"
            :x1="endCoords.x"
            :y1="endCoords.y"
            :x2="leftHandleCoords.x"
            :y2="leftHandleCoords.y" />
        <line
            :class="$style.line"
            :x1="endCoords.x"
            :y1="endCoords.y"
            :x2="rightHandleCoords.x"
            :y2="rightHandleCoords.y" />
    </svg>
</template>

<style lang="scss" module>
    .svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .line {
            stroke: red;
            fill: none;
            stroke-width: 2;
            stroke-linecap: round;
        }
    }
</style>