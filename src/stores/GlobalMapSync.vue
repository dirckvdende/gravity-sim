<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import type { PositionRectTracker } from '@/oldmap/positionRectTracker';
    import { useMapStateStore } from './mapState';
    import { syncRef } from '@vueuse/core';

    const { tracker } = defineProps<{
        /** Tracker used by the map */
        tracker: PositionRectTracker,
    }>()

    // References to store state properties
    const storeRefs = storeToRefs(useMapStateStore())

    /**
     * Sync properties of the tracker and store refs
     * @param properties Names of the properties to sync
     */
    function syncProp(...properties: (keyof PositionRectTracker & keyof typeof
    storeRefs)[]) {
        for (const prop of properties)
            // Any is used to prevent error because TypeScript doesn't know if
            // storeRefs[prop] and tracker[prop] have the same type
            syncRef(storeRefs[prop] as any, tracker[prop] as any, {
                direction: "both",
                immediate: true,
            })
    }
    
    syncProp("position", "zoomLevel")
</script>

<template></template>