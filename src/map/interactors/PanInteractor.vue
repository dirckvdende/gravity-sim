<script setup lang="ts">
    import { inject } from 'vue';
    import { defaultState, mapStateKey } from '../state';
    import { usePointerPan } from './usePointerPan';

    const { disabled = false } = defineProps<{
        /** Whether panning is enabled (default false) */
        disabled?: boolean
    }>()

    const { target, panPixels } = inject(mapStateKey, defaultState())

    usePointerPan((diff) => {
        if (disabled)
            return
        panPixels(diff)
    }, { target })
</script>

<template></template>