<script lang="ts" setup>
    import Vector2 from '@/util/Vector2';
    import { useElementSize } from '@vueuse/core';
    import { computed, ref, useTemplateRef, watch } from 'vue';

    const {
        point,
        maxPoints = 10000,
        drawPoint = false,
        drawCenterPoint = false,
    } = defineProps<{
        /**
         * Current point to draw a line to. Changing this value will draw the
         * graph
         */
        point?: Vector2 | null
        /**
         * Maximum number of points before starting to remove points from the
         * start of the path (default 10,000)
         */
        maxPoints?: number
        /**
         * Draw a circle at the position of the latest point. Can be a boolean
         * for on-off switch, or a string with the color of the point (default
         * false, default color red)
         */
        drawPoint?: boolean | string
        /**
         * Draw a circle at the zero vector. Can be a boolean for on-off switch,
         * or a string with the color of the point (default false, default color
         * blue)
         */
        drawCenterPoint?: boolean | string
    }>()

    const LOG_STEP = 1.3
    const EXTRA_SPACE = 1.1

    const points = ref<Vector2[]>([])
    watch(() => point, () => {
        if (point)
            points.value.push(point)
        if (points.value.length > maxPoints)
            points.value.splice(0, 1)
    }, { immediate: true })

    const minSize = computed(() => {
        let max = 0
        for (const point of points.value) {
            let maxCoord = Math.max(Math.abs(point.x), Math.abs(point.y))
            if (maxCoord == 0)
                continue
            max = Math.max(max, Math.ceil(Math.log(maxCoord * EXTRA_SPACE)
                / Math.log(LOG_STEP)))
        }
        return Math.pow(LOG_STEP, max) * 2
    })
    const {
        width: pixelWidth,
        height: pixelHeight,
    } = useElementSize(useTemplateRef("container"))
    const pixelSize = computed(() =>
        minSize.value / Math.min(pixelWidth.value, pixelHeight.value))

    function toPixelCoords(coords: Vector2): Vector2 {
        return new Vector2(pixelWidth.value / 2, pixelHeight.value / 2).add(
            coords.scale(1 / pixelSize.value))
    }

    const pixelPoints = computed(() => points.value.map(toPixelCoords))
    const path = computed(() => {
        let out = ""
        for (const [index, { x, y }] of pixelPoints.value.entries()) {
            if (index == 0)
                out += `M ${x} ${y}`
            else
                out += ` L ${x} ${y}`
        }
        return out
    })

    /** Clear the currently drawn line */
    function clear(): void {
        points.value = []
    }

    defineExpose({ clear })
</script>

<template>
    <div :class="$style.container" ref="container">
        <svg>
            <path :d="path" />
            <circle
                v-if="drawPoint && pixelPoints[pixelPoints.length - 1]"
                :cx="pixelPoints[pixelPoints.length - 1]?.x"
                :cy="pixelPoints[pixelPoints.length - 1]?.y"
                r="4"
                :fill="drawPoint === true ? 'red' : drawPoint"
                stroke="none" />
            <circle
                v-if="drawCenterPoint"
                :cx="pixelWidth / 2"
                :cy="pixelHeight / 2"
                r="4"
                :fill="drawCenterPoint === true ? 'blue' : drawCenterPoint"
                stroke="none" />
        </svg>
    </div>
</template>

<style lang="scss" module>
    .container {
        width: 100%;
        aspect-ratio: 5 / 3;
        background-color: #eee;
        border-radius: .2em;
        display: flex;

        & > svg {
            width: 100%;
            height: 100%;
            stroke: var(--side-menu-text-color);
            stroke-width: 1;
            fill: none;
        }
    }
</style>