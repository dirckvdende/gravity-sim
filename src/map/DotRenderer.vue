<script lang="ts" setup>
    import Vector2 from '@/util/Vector2';
    import type { PositionRectTracker } from './positionRectTracker';
    import { computed } from 'vue';

    const {
        tracker,
        coords,
        radius = 5,
        className,
    } = defineProps<{
        /**
         * Position rect tracker that is used to determine position and zoom
         * level
         */
        tracker: PositionRectTracker,
        /** The coordinates point to display */
        coords: Vector2,
        /** Radius of the point (default 5) */
        radius?: number,
        /** CSS class to give to the circle SVG elements */
        className?: string,
    }>()

    const { toPixelCoords } = tracker
    const pixelCoords = computed(() => toPixelCoords(coords))
</script>

<template>
    <svg :class="$style.svg">
        <circle
            :cx="pixelCoords.x"
            :cy="pixelCoords.y"
            :r="radius"
            :class="[$style.dot, className]" />
    </svg>
</template>

<style lang="scss" module>
    .svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .dot {
            fill: purple;
        }
    }
</style>