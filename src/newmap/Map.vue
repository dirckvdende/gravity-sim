<script setup lang="ts">
    import { computed, provide, ref, useTemplateRef, watch } from 'vue';
    import { extendMapState, mapStateKey } from './state';
    import Vector2 from '@/util/Vector2';
    import { useElementSize } from '@vueuse/core';

    const target = useTemplateRef("target")
    const elementSize = useElementSize(target)
    const position = ref(Vector2.Zero)
    const zoomLevel = ref(0)
    const targetSize = computed(() => new Vector2(
        elementSize.width.value,
        elementSize.height.value,
    ))
    
    const state = extendMapState({
        target,
        position,
        zoomLevel,
        targetSize,
    })
    provide(mapStateKey, state)

    watch(state.position, (newState) => console.log(newState), {
        immediate: true })
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
        position: relative;
        touch-action: none;
    }
</style>