<script lang="ts" setup>
    import type { PositionRectTracker } from '@/map/positionRectTracker';
    import Vector2 from '@/util/Vector2';
    import { computed } from 'vue';

    defineProps<{
        /** Tracker used to display the map */
        tracker: PositionRectTracker,
    }>()

    // Space left at the sides of the arrow
    const SIDE_SPACE = 5
    // Height of the arrow SVG
    const HEIGHT = 13
    // Line width of the arrow
    const LINE_WIDTH = 2

    // length of the arrow in units
    const unitLength = computed(() => 10000)
    // Length of the arrow in pixels
    const pixelLength = computed(() => 100)
    // SVG path of the arrow
    const path = computed(() => {
        const diff = new Vector2(
            HEIGHT / 2 - LINE_WIDTH,
            HEIGHT / 2 - LINE_WIDTH,
        )
        return `
            M 0 ${HEIGHT / 2}
            l ${diff.x} ${diff.y}
            m ${-diff.x} ${-diff.y}
            l ${diff.x} ${-diff.y}
            m ${-diff.x} ${diff.y}
            L ${pixelLength.value} ${HEIGHT / 2}
            z
            M ${pixelLength.value} ${HEIGHT / 2}
            l ${-diff.x} ${diff.y}
            m ${diff.x} ${-diff.y}
            l ${-diff.x} ${-diff.y}
            m ${diff.x} ${diff.y}
        `
    })
    // Dimensions of the arrow SVG
    const dimensions = computed(() =>
        new Vector2(pixelLength.value + SIDE_SPACE * 2, HEIGHT))
    // ViewBox of the arrow SVG
    const viewBox = computed(() =>
        `-${SIDE_SPACE} 0 ${dimensions.value.x} ${dimensions.value.y}`)
    // Label to display as HTML (!)
    const label = computed(() => {
        const logLength = Math.round(Math.log10(unitLength.value))
        return `10<sup>${logLength}</sup> m`
    })
</script>

<template>
    <div :class="$style.container">
        <div :class="$style.label" v-html="label" />
        <svg :class="$style.arrow" :width="dimensions.x" :height="dimensions.y"
        :viewBox="viewBox" :style="{
            strokeWidth: LINE_WIDTH
        }">
            <path :d="path" />
        </svg>
    </div>
</template>

<style lang="scss" module>
    .container {
        position: fixed;
        bottom: 3.2em;
        left: .5em;
        display: flex;
        flex-direction: column;
        align-items: center;

        .label {
            font-size: .8em;
        }

        .arrow {
            stroke: black;
            stroke-linecap: round;
            fill: none;
        }
    }
</style>