<script setup lang="ts">
    import { defaultState, mapStateKey } from '@/map/state';
    import type Vector2 from '@/util/linalg/Vector2';
    import { computed, inject } from 'vue';

    const { start, end } = defineProps<{
        /** Coordinates of the start of the arrow */
        start: Vector2
        /** Coordinates of the tip of the arrow */
        end: Vector2
    }>()

    const { toPixelCoords } = inject(mapStateKey, defaultState())
    const startCoords = computed(() => toPixelCoords(start))
    const endCoords = computed(() => toPixelCoords(end))
</script>

<template>
    <svg :class="$style.svg">
        <!-- TODO: Implement this properly with arrow and better styling -->
        <line
            :class="$style.line"
            :x1="startCoords.x"
            :y1="startCoords.y"
            :x2="endCoords.x"
            :y2="endCoords.y" />
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
        }
    }
</style>