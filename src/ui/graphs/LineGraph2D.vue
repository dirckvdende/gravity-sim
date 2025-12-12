<script lang="ts" setup>
    import Vector2 from '@/util/Vector2';
    import { useElementSize } from '@vueuse/core';
    import { computed, ref, useTemplateRef, watch } from 'vue';

    const { point, maxPoints = 10000 } = defineProps<{
        /**
         * Current point to draw a line to. Changing this value will draw the
         * graph
         */
        point?: Vector2 | null
        maxPoints?: number
    }>()

    const points = ref<Vector2[]>([])
    watch(() => point, () => {
        if (point)
            points.value.push(point)
        if (points.value.length > maxPoints)
            points.value.splice(0, 1)
    })

    const minSize = computed(() => {
        let max = 0
        for (const point of points.value) {
            let maxCoord = Math.max(Math.abs(point.x), Math.abs(point.y))
            if (maxCoord == 0)
                continue
            max = Math.max(max, Math.ceil(Math.log2(maxCoord)))
        }
        return Math.pow(2, max + 1)
    })
    const {
        width: pixelWidth,
        height: pixelHeight,
    } = useElementSize(useTemplateRef("container"))
    const pixelSize = computed(() =>
        minSize.value / Math.min(pixelWidth.value, pixelHeight.value))

    function toPixelCoords(coords: Vector2): Vector2 {
        return new Vector2(pixelWidth.value / 2, pixelHeight.value / 2).add(coords.scale(1 / pixelSize.value))
    }

    const path = computed(() => {
        console.log("minSize", minSize.value)
        console.log("pixelSize", pixelSize.value)
        let out = ""
        for (const [index, point] of points.value.entries()) {
            const { x, y } = toPixelCoords(point)
            if (index == 0)
                out += `M ${x} ${y}`
            else
                out += ` L ${x} ${y}`
        }
        return out
    })
</script>

<template>
    <div :class="$style.container" ref="container">
        <svg>
            <path :d="path" stroke="black" stroke-width="3" fill="none" />
        </svg>
    </div>
</template>

<style lang="scss" module>
    .container {
        width: 100%;
        aspect-ratio: 5 / 3;
        background-color: green;
        display: flex;

        & > svg {
            width: 100%;
            height: 100%;
        }
    }
</style>