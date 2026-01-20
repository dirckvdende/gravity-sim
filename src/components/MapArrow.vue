<script setup lang="ts">
    import { defaultState } from '@/util/mapState';
    import { mapStateKey } from '@/util/keys';
    import Vector2 from '@/util/linalg/Vector2';
    import Vector3 from '@/util/linalg/Vector3';
    import { computed, inject } from 'vue';

    const {
        start,
        end,
        color = "var(--accent-color-blue)",
    } = defineProps<{
        /** Coordinates of the start of the arrow */
        start: Vector3
        /** Coordinates of the tip of the arrow */
        end: Vector3
        /** Arrow color (default blue accent color) */
        color?: string
    }>()

    const HANDLE_ANGLE = Math.PI * 0.22
    const HANDLE_LENGTH = 10

    const { toPixelCoords3D } = inject(mapStateKey, defaultState())
    const startCoords = computed(() => toPixelCoords3D(start))
    const endCoords = computed(() => toPixelCoords3D(end))
    const angle = computed(() => {
        if (!startCoords.value || !endCoords.value)
            return null
        const diff = endCoords.value.subtract(startCoords.value)
        return (diff.isZero() ? 0 : diff.angle()) + Math.PI
    })
    const leftHandleCoords = computed(() => {
        if (!endCoords.value || !angle.value)
            return null
        return endCoords.value.add(
            new Vector2(HANDLE_LENGTH, 0).rotate(angle.value - HANDLE_ANGLE))
    })
    const rightHandleCoords = computed(() => {
        if (!endCoords.value || !angle.value)
            return null
        return endCoords.value.add(
            new Vector2(HANDLE_LENGTH, 0).rotate(angle.value + HANDLE_ANGLE))
    })
</script>

<template>
    <svg :class="$style.svg" :style="{
        '--line-color': color,
    }" v-if="startCoords && endCoords && leftHandleCoords && rightHandleCoords">
        <line
            :class="$style.line"
            :x1="startCoords.x"
            :y1="startCoords.y"
            :x2="endCoords.x"
            :y2="endCoords.y" />
        <line
            :class="$style.line"
            :x1="endCoords.x"
            :y1="endCoords.y"
            :x2="leftHandleCoords.x"
            :y2="leftHandleCoords.y" />
        <line
            :class="$style.line"
            :x1="endCoords.x"
            :y1="endCoords.y"
            :x2="rightHandleCoords.x"
            :y2="rightHandleCoords.y" />
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
            stroke: color-mix(in srgb, var(--line-color),
                var(--background-color) 30%);
            fill: none;
            stroke-width: 2;
            stroke-linecap: round;
        }
    }
</style>