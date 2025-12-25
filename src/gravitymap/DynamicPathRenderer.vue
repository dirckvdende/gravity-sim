<script setup lang="ts">
    import { defaultState, mapStateKey } from '@/map/state';
    import Vector2 from '@/util/linalg/Vector2';
    import { computed, inject, ref, watch } from 'vue';

    const GROUP_SIZE = 50

    const {
        point,
        maxPoints = 1000,
    } = defineProps<{
        /** Current head of the path */
        point: Vector2
        /** Maximum number of points to include in the path (default 1000) */
        maxPoints?: number
    }>()

    const {
        zoomLevel,
        position,
        viewport,
        pixelSize,
    } = inject(mapStateKey, defaultState())

    type Path = {
        /** SVG path definition */
        d: string
        /** Points list fallback for when paths need to be recalculated */
        points: Vector2[]
    }

    const paths = ref<Path[]>([])
    const totalPoints = ref(0)
    const targetScale = computed(() => Math.floor(zoomLevel.value / 3) * 3)
    watch(targetScale, () => recalculatePaths())
    watch(() => point, (point) => {
        addPoint(point)
        if (totalPoints.value > maxPoints)
            removeFirstPart()
    }, { deep: false })
    const transform = computed(() => {
        const scale = `scale(${Math.exp(zoomLevel.value - targetScale.value)})`
        const pixelScale = Math.exp(-targetScale.value)
        const translateBefore = `translate(${-position.value.x / pixelScale} ${
            -position.value.y / pixelScale})`
        const { bottomRight, topLeft } = viewport.value
        const width = bottomRight.x - topLeft.x
        const height = bottomRight.y - topLeft.y
        const translateAfter = `translate(${width / pixelSize.value / 2} ${
            height / pixelSize.value / 2})`
        return `${translateAfter} ${scale} ${translateBefore}`
    })

    function toScaleCoords(point: Vector2): Vector2 {
        return point.scale(Math.exp(targetScale.value))
    }

    function addPoint(point: Vector2): void {
        const coords = toScaleCoords(point)
        const lastPath = paths.value[paths.value.length - 1]
        if (lastPath != undefined) {
            lastPath.points.push(point)
            lastPath.d += ` L ${coords.x} ${coords.y}`
        }
        if (lastPath == undefined || lastPath.points.length >= GROUP_SIZE) {
            paths.value.push({
                d: `M ${coords.x} ${coords.y}`,
                points: [point],
            })
        }
        totalPoints.value++
    }

    function removeFirstPart(): void {
        const firstPath = paths.value[0]
        if (firstPath == undefined)
            return
        totalPoints.value -= firstPath.points.length
        paths.value.splice(0, 1)
    }

    function recalculatePaths(): void {
        for (const path of paths.value) {
            path.d = ""
            for (const point of path.points) {
                const coords = toScaleCoords(point)
                path.d += `${path.d == '' ? 'M' : 'L'}${coords.x} ${coords.y}`
            }
        }
    }
</script>

<template>
    <svg :class="$style.svg">
        <g :transform="transform">
            <path
                v-for="{ d } in paths"
                :d="d"
                :class="$style.line"
                :style="{
                    strokeWidth: 2 / Math.exp(zoomLevel - targetScale),
                }" />
        </g>
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
            stroke: var(--orbit-color, #aaa);
            stroke-width: 2;
            fill: none;
        }
    }
</style>