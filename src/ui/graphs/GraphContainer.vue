<script lang="ts" setup>
    import GraphControls from './GraphControls.vue';
    import type { GraphControlsDefition } from './GraphControls.vue';

    const { controls } = defineProps<{
        controls?: GraphControlsDefition
    }>()
</script>

<template>
    <div :class="$style.wrapper">
        <div :class="$style.container">
            <slot />
        </div>
        <GraphControls v-if="controls !== undefined" :controls="controls"
            :class="$style.controls" />
    </div>
</template>

<style lang="scss" module>
    .wrapper {
        width: 100%;
        aspect-ratio: 5 / 3;
        background-color: color-mix(in srgb, var(--side-menu-text-color),
            transparent 90%);
        border-radius: .2em;
        display: flex;
        position: relative;
    }

    .container {
        width: 100%;
        height: 100%;
        display: flex;
    }

    @media (pointer: fine) {
        .wrapper:not(:hover) .controls {
            display: none;
        }
    }
</style>