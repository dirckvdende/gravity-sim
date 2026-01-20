<script setup lang="ts">
    import { computed, provide, ref, useTemplateRef } from 'vue';
    import { extendMapState } from '@/util/mapState';
    import { mapStateKey } from '@/util/keys';
    import Vector2 from '@/util/linalg/Vector2';
    import { useElementSize } from '@vueuse/core';

    const target = useTemplateRef("target")
    const elementSize = useElementSize(target)
    const position = ref(Vector2.Zero)
    const zoomLevel = ref(0)
    const targetSize = computed(() => new Vector2(
        elementSize.width.value,
        elementSize.height.value,
    ))
    const inverseFocalLength = ref(0)
    
    const state = extendMapState({
        target,
        position,
        zoomLevel,
        targetSize,
        inverseFocalLength,
    })
    provide(mapStateKey, state)
    defineExpose({ state })
</script>

<template>
    <div :class="$style.container">
        <div :class="$style.target" ref="target">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" module>
    .container {
        width: 600px;
        height: 400px;

        .target {
            width: 100%;
            height: 100%;
            position: relative;
            touch-action: none;
            overflow: hidden;
        }
    }
</style>