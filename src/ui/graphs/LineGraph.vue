<script setup lang="ts">
    import { useAnimationFrame } from '@/util/animationFrame';
    import GraphContainer from './GraphContainer.vue';
    import { mdiDeleteOutline, mdiContentSaveOutline } from '@mdi/js';
    import { ref, useTemplateRef, computed } from 'vue';
    import { useElementSize } from '@vueuse/core';
    import Vector2 from '@/util/Vector2';
    import { downloadNodeAsString } from '@/util/downloadNodeAsString';

    const {
        value,
        maxTime = 10,
    } = defineProps<{
        /**
         * Current height of the graph. If this is set to null or undefined,
         * the graph will not be updated. Otherwise, it will be updated every
         * animation frame (even if the value doesn't change)
         */
        value?: number | null
        /** Maximum time to look back in seconds (default 10) */
        maxTime?: number
    }>()

    const LOG_STEP = 1.3
    const EXTRA_SPACE = 1.1

    // Values as [timestamp, value]
    const values = ref<[number, number][]>([])
    const firstTimestamp = computed(() => values.value[0]?.[0] ?? 0)
    const latestTimestamp = computed(() =>
        values.value[values.value.length - 1]?.[0] ?? 0)
    let lastTimestamp = performance.now()
    useAnimationFrame(() => {
        const timeDiff = performance.now() - lastTimestamp
        lastTimestamp = performance.now()
        if (value === null || value === undefined)
            return
        const last = values.value[values.value.length - 1]?.[0] ?? 0
        const timestamp = timeDiff + last
        while (values.value.length > 0 && timestamp - firstTimestamp.value >
        maxTime * 1000)
            values.value.splice(0, 1)
        console.log()
        values.value.push([timestamp, value])
    })

    const minSize = computed(() => {
        let max = 0
        for (const [_timestamp, value] of values.value) {
            let maxCoord = Math.abs(value)
            if (maxCoord == 0)
                continue
            max = Math.max(max, Math.ceil(Math.log(maxCoord * EXTRA_SPACE)
                / Math.log(LOG_STEP)))
        }
        return Math.pow(LOG_STEP, max)
    })
    const hasNegative = computed(() => {
        for (const [_timestamp, value] of values.value)
            if (value < 0)
                return true
        return false
    })
    const {
        width: pixelWidth,
        height: pixelHeight,
    } = useElementSize(useTemplateRef("container"))
    const pixelSize = computed(() =>
        minSize.value / Math.min(pixelWidth.value, pixelHeight.value)
        * (hasNegative.value ? 2 : 1))

    function toPixelCoords([timestamp, value]: [number, number]): Vector2 {
        const y = pixelHeight.value - (value / pixelSize.value +
            (hasNegative.value ? pixelHeight.value / 2 : 0))
        if (firstTimestamp.value == latestTimestamp.value)
            return new Vector2(0, y)
        const x = timestamp == firstTimestamp.value ? 0 : (timestamp -
            firstTimestamp.value) / (latestTimestamp.value -
            firstTimestamp.value) * pixelWidth.value
        return new Vector2(x, y)
    }

    const pixelPoints = computed(() => values.value.map(toPixelCoords))
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
        values.value = []
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
            <path :d="path" :class="$style.path" />
            <line
                :x1="0"
                :y1="pixelHeight / 2"
                :x2="pixelWidth"
                :y2="pixelHeight / 2"
                :class="$style['zero-line']"
                v-if="hasNegative" />
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

        .zero-line {
            stroke: color-mix(in srgb, var(--side-menu-text-color),
                transparent 50%);
        }
    }
</style>