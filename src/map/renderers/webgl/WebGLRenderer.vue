<script setup lang="ts">
    import { computed, inject, provide, useTemplateRef } from 'vue';
    import { webGLKey } from './state';
    import { useWebGLTransform } from './useWebGLTransform';
    import { defaultState, mapStateKey } from '@/map/state';
    import Vector2 from '@/util/linalg/Vector2';

    const { position, pixelSize } = inject(mapStateKey, defaultState())
    const translate = computed(() => position.value.negate())
    const scale = computed(() => {
        const value = pixelSize.value
        return new Vector2(value, value)
    })

    const canvas = useTemplateRef("canvas")
    const webgl = useWebGLTransform(canvas, {
        translate,
        scale,
        scaleToCanvas: true,
    })
    provide(webGLKey, webgl)
</script>

<template>
    <canvas :class="$style.canvas" ref="canvas">
        WebGL renderer not supported.
    </canvas>
    <slot />
</template>

<style lang="scss" module>
    .canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>