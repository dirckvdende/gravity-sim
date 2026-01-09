<script setup lang="ts">
    import { computed } from 'vue';
    import { inject } from 'vue';
    import { defaultState } from '@/util/mapState';
    import { mapStateKey } from '@/util/keys';

    const { viewport } = inject(mapStateKey, defaultState())
    const viewBox = computed(() => {
        const { x: xmin, y: ymin } = viewport.value.topLeft
        const { x: xmax, y: ymax } = viewport.value.bottomRight
        return `${xmin} ${ymin} ${xmax - xmin} ${ymax - ymin}`
    })
</script>

<template>
    <svg
        ref="svg"
        :viewBox="viewBox"
        :class="$style.svg">
        <slot />
    </svg>
</template>

<style lang="scss" module>
    .svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
</style>