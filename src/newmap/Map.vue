<script setup lang="ts">
    import { provide, ref, toRef, useTemplateRef, watch, type Ref } from 'vue';
    import { mapStateKey, type MapState } from './state';
    import Vector2 from '@/util/Vector2';

    const state: Ref<MapState> = ref({
        target: useTemplateRef("target"),
        position: Vector2.Zero,
        zoomLevel: 0,
        targetSize: Vector2.Zero,
    })
    provide(mapStateKey, state)
</script>

<template>
    <div :class="$style.target" ref="target">
        <slot />
    </div>
</template>

<style lang="scss" module>
    .target {
        width: 600px;
        height: 400px;
        background-color: red;
    }
</style>