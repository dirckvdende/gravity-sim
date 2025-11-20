<script lang="ts" setup>
    import { computed, type ComputedRef } from 'vue';
    import type { PositionRectTracker } from './positionRectTracker';
    import Vector2 from '@/util/Vector2';

    const {
        tracker,
        stepSize = 2,
        color = "#eee",
        width = .01,
        minPixelWidth = 2,
        scaleTimes = {
            startFade: 15,
            start: 50,
            end: 700,
            endFade: 800,
        },
    } = defineProps<{
        /**
         * Position rect tracker that is used to determine position and zoom
         * level
         */
        tracker: PositionRectTracker,
        /**
         * Multiplier between smaller and larger grid cells (default 2). Making
         * this a non-integer will result in unusual behaviour and is not
         * recommended
         */
        stepSize?: number,
        /**
         * Color of the grid lines (default #eee)
         */
        color?: string,
        /**
         * Realtive width of grid lines in units (default .01)
         */
        width?: number,
        /**
         * Minimum width in pixels any line will be drawn, even it should be
         * thinner due to scaling (default 2)
         */
        minPixelWidth?: number,
        /**
         * Times (number of pixels per scale) at which grid lines should
         * appear/disappear. Default { startFade: 15, start: 50, end: 700,
         * endFade: 800 }
         */
        scaleTimes?: {
            startFade: number,
            start: number,
            end: number,
            endFade: number,
        },
    }>()

    /**
     * Definition of a line to be displayed
     */
    type Line = {
        type: "horizontal" | "vertical",
        coord: number,
        width: number,
        transparency: number,
    }

    function gridLinesBetween(start: number, end: number, scale: number):
    number[] {
        const out: number[] = []
        for (let x = floorToMultiple(start, scale); x <= end; x += scale)
            out.push(x)
        return out
    }

    function gridAtScale(scale: number): Line[] {
        const { viewport } = tracker
        const lineWidth = scale * width
        const out: Line[] = []
        const transparency = scaleTransparency(scale)
        for (const coord of gridLinesBetween(viewport.value.topLeft.x,
        viewport.value.bottomRight.x, scale))
            out.push({
                coord,
                type: "vertical",
                width: lineWidth,
                transparency,
            })
        for (const coord of gridLinesBetween(viewport.value.topLeft.y,
        viewport.value.bottomRight.y, scale))
            out.push({
                coord,
                type: "horizontal",
                width: lineWidth,
                transparency,
            })
        return out
    }

    function scaleTransparency(scale: number): number {
        const pixels = scale / tracker.pixelSize.value
        const { startFade, start, end, endFade } = scaleTimes
        if (pixels < startFade)
            return 1
        if (pixels < start)
            return 1 - (pixels - startFade) / (start - startFade)
        if (pixels < end)
            return 0
        if (pixels < endFade)
            return (pixels - end) / (endFade - end)
        return 1
    }

    function scales(): number[] {
        const pixelSize = tracker.pixelSize.value
        const out: number[] = []
        const startScale = floorToPower(scaleTimes.start * pixelSize, stepSize)
        const endScale = scaleTimes.endFade * pixelSize
        for (let scale = startScale; scale < endScale; scale *= stepSize)
            out.push(scale)
        return out
    }

    function floorToMultiple(value: number, multiple: number): number {
        return Math.floor(value / multiple) * multiple
    }

    function floorToPower(value: number, base: number): number {
        return Math.pow(base, Math.floor(Math.log(value) / Math.log(base)))
    }

    const lines: ComputedRef<Line[]> = computed(() => {
        const out: Line[] = []
        for (const scale of scales())
            out.push(...gridAtScale(scale))
        return out
    })

    const { toPixelCoords, pixelSize } = tracker
</script>

<template>
    <template v-for="line in lines">
        <div
            v-if="line.type == 'horizontal'"
            :class="$style.line"
            :style="{
                left: '0',
                right: '0',
                top: `${toPixelCoords(new Vector2(0, line.coord)).y}px`,
                height: `${Math.max(line.width / pixelSize, minPixelWidth)}px`,
                backgroundColor: color,
                opacity: `${1 - line.transparency}`,
                translate: '0 -50%',
            }" />
        <div
            v-if="line.type == 'vertical'"
            :class="$style.line"
            :style="{
                left: `${toPixelCoords(new Vector2(line.coord, 0)).x}px`,
                width: `${Math.max(line.width / pixelSize, minPixelWidth)}px`,
                top: '0',
                bottom: '0',
                backgroundColor: color,
                opacity: `${1 - line.transparency}`,
                translate: '-50% 0',
            }" />
    </template>
</template>

<style lang="scss" module>
    .line {
        position: absolute;
    }
</style>