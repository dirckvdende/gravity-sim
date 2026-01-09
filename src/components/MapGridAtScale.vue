<script setup lang="ts">
    import Vector2 from '@/util/linalg/Vector2';
    import { computed, inject, useTemplateRef } from 'vue';
    import { defaultState } from '../util/mapState';
    import { mapStateKey } from '@/util/keys';
    import { useElementSize } from '@vueuse/core';

    const {
        color,
        lineWidth,
        separation,
        offset = Vector2.Zero,
    } = defineProps<{
        /** Color of the grid lines */
        color: string,
        /** Grid line width in pixels (not in map units!) */
        lineWidth: number,
        /** Separation between lines in map units */
        separation: number,
        /** Offset of the grid in map units (default no offset) */
        offset?: Vector2,
    }>()

    // Get the current map state
    const { viewport, toPixelCoords } = inject(mapStateKey, defaultState())
    const { width, height } = useElementSize(useTemplateRef("svg"))

    /** A line to be drawn to the SVG */
    type Line = {
        x1: number, y1: number,
        x2: number, y2: number,
    }

    /**
     * Floor a number to a multiple of another (positive) number
     * @param value To number to floor
     * @param multiple The multiple to floor to
     * @param offset An optional offset to apply to the result (default 0)
     * @returns The floored number
     */
    function floorToMultiple(value: number, multiple: number,
    offset: number = 0): number {
        offset %= multiple
        if (offset > 0)
            offset -= multiple
        return Math.floor((value - offset) / multiple) * multiple + offset
    }

    /**
     * Find grid line coords in one direction, between a given min and max coord
     * @param min Minimum coordinate
     * @param max Maximum coordinate (exclusive)
     * @param offset Offset of the grid lines
     */
    function linesInInterval(min: number, max: number, offset: number):
    number[] {
        const result: number[] = []
        const start = floorToMultiple(min, separation, offset)
        for (let coord = start; coord < max; coord += separation)
            result.push(coord)
        return result
    }

    // Array of lines that need to be rendered
    const lines = computed<Line[]>(() => {
        const { topLeft, bottomRight } = viewport.value
        const vertical = linesInInterval(topLeft.x, bottomRight.x, offset.x)
        const horizontal = linesInInterval(topLeft.y, bottomRight.y, offset.y)
        const list: Line[] = []
        for (const mapX of vertical) {
            const { x } = toPixelCoords(new Vector2(mapX, 0))
            list.push({
                x1: x, y1: 0,
                x2: x, y2: height.value,
            })
        }
        for (const mapY of horizontal) {
            const { y } = toPixelCoords(new Vector2(0, mapY))
            list.push({
                x1: 0, y1: y,
                x2: width.value, y2: y,
            })
        }
        return list
    })

</script>

<template>
    <svg :class="$style.svg" ref="svg">
        <line
            v-for="line in lines"
            :x1="line.x1" :y1="line.y1"
            :x2="line.x2" :y2="line.y2"
            :stroke="color"
            :stroke-width="lineWidth" />
    </svg>
</template>

<style lang="scss" module>
    .svg {
        position: absolute;
        pointer-events: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>