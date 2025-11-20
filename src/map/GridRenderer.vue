<script lang="ts" setup>
    import { computed, type ComputedRef } from 'vue';
    import type { PositionRectTracker } from './positionRectTracker';
    import Vector2 from '@/util/Vector2';

    const { tracker } = defineProps<{
        /**
         * Position rect tracker that is used to determine position and zoom
         * level
         */
        tracker: PositionRectTracker,
    }>()

    /**
     * Definition of a line to be displayed
     */
    type Line = {
        left: number,
        top: number,
        width: number,
        height: number,
    }

    function floorToMultiple(value: number, multiple: number): number {
        return Math.floor(value / multiple) * multiple
    }

    const lines: ComputedRef<Line[]> = computed(() => {
        const out: Line[] = []
        const { dimensions, viewport, toPixelCoords } = tracker
        // Horizontal lines
        for (let y = floorToMultiple(viewport.value.topLeft.y, 100); y <=
        viewport.value.bottomRight.y; y += 100) {
            out.push({
                left: 0,
                top: toPixelCoords(new Vector2(0, y)).y,
                width: dimensions.value.x,
                height: 2,
            })
        }
        // Vertical lines
        for (let x = floorToMultiple(viewport.value.topLeft.x, 100); x <=
        viewport.value.bottomRight.x; x += 100) {
            out.push({
                left: toPixelCoords(new Vector2(x, 0)).x,
                top: 0,
                width: 2,
                height: dimensions.value.y,
            })
        }
        return out
    })
</script>

<template>
    <div
        v-for="line in lines"
        :class="$style.line"
        :style="{
            left: `${line.left}px`,
            top: `${line.top}px`,
            width: `${line.width}px`,
            height: `${line.height}px`,
        }" />
</template>

<style lang="scss" module>
    .line {
        position: absolute;
        background-color: black;
    }
</style>