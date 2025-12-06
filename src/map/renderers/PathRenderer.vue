<script lang="ts" setup>
    import Vector2 from '@/util/Vector2';
    import { computed, inject } from 'vue';
    import { defaultState, mapStateKey } from '../state';

    const {
        points,
        className,
    } = defineProps<{
        /**
         * The points that make up the path. Fewer than 2 points aren't rendered
         */
        points: Vector2[],
        /** CSS class to give to the line elements */
        className?: string,
    }>()

    const { toPixelCoords } = inject(mapStateKey, defaultState())

    // SVG path definition
    const pathDef = computed(() => {
        if (points[0] == undefined)
            return ""
        const result: string[] = []
        for (const [index, point] of points.entries()) {
            const coords = toPixelCoords(point)
            if (index == 0)
                result.push(`M ${coords.x} ${coords.y}`)
            else
                result.push(`L ${coords.x} ${coords.y}`)
        }
        return result.join(" ")
    })
</script>

<template>
    <svg :class="$style.svg">
        <path
            :d="pathDef"
            :class="[$style.line, className]" />
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