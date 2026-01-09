<script setup lang="ts">
    import { computed, inject } from 'vue';
    import { defaultState } from '../util/mapState';
    import { mapStateKey } from '@/util/keys';
    import Vector2 from '@/util/linalg/Vector2';
    import MapGridAtScale from './MapGridAtScale.vue';

    const {
        separationInterval = [2, 5],
        color = "#eee",
        width = .01,
        minPixelWidth = 2,
        visibilityRange = [40, 750],
        offset = Vector2.Zero,
    } = defineProps<{
        /**
         * Interval between grid line separation scales. Can be a non-empty
         * array of intervals that are alternated (default [2, 5])
         */
        separationInterval?: number[] | number
        /** Color of the grid lines when they're fully opaque (default #eee) */
        color?: string
        /**
         * Width of grid lines as a proportion of separation between lines
         * (default .01, i.e. 1%)
         */
        width?: number
        /**
         * Minimum width of a grid line in pixels (default 2). If width prop
         * would yield a smaller width this width is taken. Set to zero to
         * disable
         */
        minPixelWidth?: number
        /**
         * Range where a grid at a certain scale should be visible. If the grid
         * lines have a separation of s pixels, then the grid will at this scale
         * will be visible if s is in the interval [a, b], where [a, b] is the
         * argument passed to this prop as an array of two numbers. Four numbers
         * can be given to add a fade in/out effect. Numbers should be given in
         * increasing order (default [40, 750])
         */
        visibilityRange?: [number, number] | [number, number, number, number]
        /** Offset of the grid in map units (default no offset) */
        offset?: Vector2
    }>()

    // Get the current map state
    const { pixelSize } = inject(mapStateKey, defaultState())

    /**
     * Convert a separation between grid lines in map units to pixels
     * @param separation Separation between grid lines in map units
     * @returns The separation in pixels
     */
    function pixelSeparation(separation: number): number {
        return separation / pixelSize.value
    }

    /**
     * Add fade start and end to visibility range if these have not been added
     * @returns The visibility range with fade start, start, end, fade end
     * (array of four numbers)
     */
    function fullVisibilityRange(): [number, number, number, number] {
        return visibilityRange.length == 2
            ? [visibilityRange[0], visibilityRange[0], visibilityRange[1],
            visibilityRange[1]]
            : visibilityRange
    }

    /**
     * Get the opacity lines should have at the given scale
     * @param separation The separation between grid lines, which indicates the
     * scale
     * @returns The opacity between 0 (transparent) and 1 (opaque)
     */
    function scaleOpacity(separation: number): number {
        const pixels = pixelSeparation(separation)
        const [ startFade, start, end, endFade ] = fullVisibilityRange()
        if (pixels < startFade)
            return 0
        if (pixels < start)
            return (pixels - startFade) / (start - startFade)
        if (pixels < end)
            return 1
        if (pixels < endFade)
            return 1 - (pixels - end) / (endFade - end)
        return 0
    }

    /**
     * Get the line width of a grid at a given scale
     * @param separation The separation between grid lines, which indicates the
     * scale
     * @returns The line width of the grid in pixels
     */
    function scaleLineWidth(separation: number): number {
        return Math.max(separation * width / pixelSize.value, minPixelWidth)
    }

    /**
     * Floor a number to a power of a given base
     * @param value The number to floor
     * @param base The base to which to floor
     * @returns The floored number
     */
    function floorToPower(value: number, base: number): number {
        return Math.pow(base, Math.floor(Math.log(value) / Math.log(base)))
    }

    /**
     * Get all grid scales that should be displayed
     * @returns An array of numbers with the different line separations
     */
    function scales(): number[] {
        const intervals = typeof separationInterval == "number"
            ? [separationInterval] : separationInterval
        const totalInterval = intervals.reduce((x, y) => x * y)
        const [ startFade, _start, _end, endFade ] = fullVisibilityRange()
        const startScale = floorToPower(startFade * pixelSize.value,
            totalInterval)
        const out: number[] = []
        const endScale = endFade * pixelSize.value
        let intervalIndex = 0
        for (let separation = startScale; separation < endScale; separation *=
        intervals[intervalIndex]!) {
            if (scaleOpacity(separation) > 0)
                out.push(separation)
            intervalIndex++
            if (intervalIndex >= intervals.length)
                intervalIndex = 0
        }
        return out
    }

    /** Grid at a specific scale */
    type Grid = {
        /** Line width in pixels */
        lineWidth: number
        /** Separation between grid lines in map units */
        separation: number
        /** Opacity of the grid lines */
        opacity: number
    }

    // List of specific-scale grids to be displayed
    const grids = computed<Grid[]>(() => scales().map((separation) => ({
        separation,
        lineWidth: scaleLineWidth(separation),
        opacity: scaleOpacity(separation),
    })))
</script>

<template>
    <MapGridAtScale
        v-for="{ lineWidth, separation, opacity } in grids"
        :color="color"
        :line-width="lineWidth"
        :separation="separation"
        :offset="offset"
        :style="{ opacity }" />
</template>