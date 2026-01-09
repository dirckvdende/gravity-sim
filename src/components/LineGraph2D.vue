<script lang="ts" setup>
    import { downloadNodeAsString } from '@/util/downloadNodeAsString';
    import Vector2 from '@/util/linalg/Vector2';
    import { useElementSize } from '@vueuse/core';
    import { computed, ref, useTemplateRef, watch } from 'vue';
    import GraphContainer from '@/components/GraphContainer.vue';
    import { mdiContentSaveOutline, mdiDeleteOutline } from '@mdi/js';

    const {
        point,
        maxPoints = 10000,
        drawPoint = false,
        showAxes = false,
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
        /** Show x and y-axes in the graph (default false) */
        showAxes?: boolean
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
    
    // Ref to the SVG element
    const svg = useTemplateRef("svg")

    /** Download the plot as an SVG */
    function download(): void {
        const svgNode = svg.value
        if (!svgNode)
            return
        downloadNodeAsString(svgNode, "image/svg+xml", "download.svg")
    }
</script>

<template>
    <GraphContainer ref="container" :controls="[{
        name: 'Clear',
        iconPath: mdiDeleteOutline,
        click: clear,
    }, {
        name: 'Save',
        iconPath: mdiContentSaveOutline,
        click: download,
    }]">
        <svg :class="$style.svg" ref="svg" stroke="#333" stroke-width="1"
            fill="none" :width="pixelWidth" :height="pixelHeight">
            <line
                :x1="0"
                :y1="pixelHeight / 2"
                :x2="pixelWidth"
                :y2="pixelHeight / 2"
                :class="$style['axis-line']"
                v-if="showAxes" />
            <line
                :x1="pixelWidth / 2"
                :y1="0"
                :x2="pixelWidth / 2"
                :y2="pixelHeight"
                :class="$style['axis-line']"
                v-if="showAxes" />
            <path :d="path" />
            <circle
                v-if="drawPoint && pixelPoints[pixelPoints.length - 1]"
                :cx="pixelPoints[pixelPoints.length - 1]?.x"
                :cy="pixelPoints[pixelPoints.length - 1]?.y"
                r="4"
                :fill="drawPoint === true ? 'var(--accent-color-orange, orange)'
                    : drawPoint"
                stroke="none" />
        </svg>
    </GraphContainer>
</template>

<style lang="scss" module>
    .svg {
        width: 100%;
        height: 100%;
        stroke: var(--side-menu-text-color);
        stroke-width: 1;
        fill: none;

        .axis-line {
            stroke: color-mix(in srgb, var(--side-menu-text-color),
                transparent 50%);
        }
    }
</style>