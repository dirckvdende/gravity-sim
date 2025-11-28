<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import type { PositionRectTracker } from '@/map/positionRectTracker';
    import { useSimStateStore } from './state';
    import { syncRef } from '@vueuse/core';

    const { tracker } = defineProps<{
        /** Tracker used by the map */
        tracker: PositionRectTracker,
    }>()

    const { position } = storeToRefs(useSimStateStore())
    syncRef(position, tracker.position, { direction: "both" })
</script>

<template></template>