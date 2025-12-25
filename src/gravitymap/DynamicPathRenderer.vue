<script setup lang="ts">
    import { defaultState, mapStateKey } from '@/map/state';
    import Vector2 from '@/util/linalg/Vector2';
    import { computed, inject, ref, watch } from 'vue';

    // Maximum number of points used in a single SVG <path>
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

    /** SVG path with fallback points */
    type Path = {
        /** SVG path definition */
        d: string
        /** Points list fallback for when paths need to be recalculated */
        points: Vector2[]
    }

    // List of paths to render. This ref is updated by addPoint and
    // removeFirstPath
    const paths = ref<Path[]>([])
    // Total number of points in all paths
    const totalPoints = ref(0)
    // Target zoom level at which orbits are drawn. This value remains fixed
    // unless the actual zoom level changes by a factor of 1000 (10^3)
    const targetScale = computed(() => Math.floor(zoomLevel.value / 3) * 3)
    // When target scale changes, recalculate all SVG paths
    watch(targetScale, () => recalculatePaths())
    // When point changes, add it to the last path. Remove first path when there
    // are too many points
    watch(() => point, (point) => {
        addPoint(point)
        if (totalPoints.value > maxPoints)
            removeFirstPath()
    }, { deep: false })
    // Transform to apply to all SVG elements
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

    /**
     * Coordinate transform for path coordinates
     * @param point The original point coordinates
     * @returns The SVG path point coordinates
     */
    function toScaleCoords(point: Vector2): Vector2 {
        return point.scale(Math.exp(targetScale.value))
    }

    /**
     * Add a point to the last path
     * @param point Coordinates of the point to add
     */
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

    /**
     * Remove the first path
     */
    function removeFirstPath(): void {
        const firstPath = paths.value[0]
        if (firstPath == undefined)
            return
        totalPoints.value -= firstPath.points.length
        paths.value.splice(0, 1)
    }

    /**
     * Recalculate all SVG path definitions using toScaleCoords()
     */
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
            fill: none;
        }
    }
</style>