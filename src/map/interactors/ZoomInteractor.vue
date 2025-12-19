<script setup lang="ts">
    import { inject } from 'vue';
    import { defaultState, mapStateKey } from '../state';
    import Vector2 from '@/util/linalg/Vector2';
    import { usePointerPinch } from './usePointerPinch';
    import { useScrollWheel } from './useScrollWheel';

    const { disabled = false, wheelRatios = [1e-3, 5e-5, 1e-6] } = defineProps<{
        /** Whether the interactor is enabled or not (default false) */
        disabled?: boolean,
        /**
         * Zoom level to scroll wheel ratios, for three different delta modes
         * [DOM_DELTA_PIXEL, DOM_DELTA_LINE, DOM_DELTA_PAGE] (default
         * [1e-3, 5e-5, 1e-6]) */
        wheelRatios?: [number, number, number],
    }>()

    const {
        target,
        zoomRatio,
        zoom,
        toMapCoords,
    } = inject(mapStateKey, defaultState())

    usePointerPinch((state) => {
        if (disabled)
            return
        const position = new Vector2(state.x, state.y)
        const { ratio } = state
        const mapPosition = toMapCoords(position)
        zoomRatio(ratio, mapPosition)
    }, { target })

    useScrollWheel(target, ({ x, y, delta, deltaMode }) => {
        if (disabled)
            return
        zoom(-delta * wheelRatios[deltaMode], toMapCoords(new Vector2(x, y)))
    })
</script>

<template></template>