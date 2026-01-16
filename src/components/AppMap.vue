<script setup lang="ts">
    import MapInteractorPan from '@/components/MapInteractorPan.vue';
    import MapInteractorZoom from '@/components/MapInteractorZoom.vue';
    import Map from '@/components/Map.vue';
    import MapGrid from '@/components/MapGrid.vue';
    import { storeToRefs } from 'pinia';
    import { onMounted, useTemplateRef } from 'vue';
    import AppMapIcons from '@/components/AppMapIcons.vue';
    import AppMapOrbits from '@/components/AppMapOrbits.vue';
    import AppMapBarycenter from '@/components/AppMapBarycenter.vue';
    import AppMapRuler from '@/components/AppMapRuler.vue';
    import { syncRef } from '@vueuse/core';
    import { useGravityMapStore } from '@/stores/useGravityMapStore';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import AppMapVelocity from '@/components/AppMapVelocity.vue';
    import AppMapAcceleration from '@/components//AppMapAcceleration.vue';
import AppMapObjectLock from './AppMapObjectLock.vue';

    const map = useTemplateRef("map")
    const store = storeToRefs(useGravityMapStore())
    const { showGrid } = storeToRefs(useSettingsStore())

    /** Sync map state with gravity map store so it can be edited globally */
    function syncGravityMapStore(): void {
        if (!map.value)
            return
        const mapState = map.value.state
        const syncOptions: Parameters<typeof syncRef>[2] = {
            direction: "both",
            immediate: true,
        }
        syncRef(store.position, mapState.position, syncOptions)
        syncRef(store.zoomLevel, mapState.zoomLevel, syncOptions)
    }

    onMounted(() => {
        if (!map.value)
            return
        syncGravityMapStore()
    })
</script>

<template>
    <Map :class="$style.map" ref="map">
        <MapInteractorPan />
        <MapInteractorZoom />
        <AppMapObjectLock />
        <MapGrid
            v-if="showGrid"
            :separation-interval="[2, 5]"
            :visibility-range="[15, 50, 700, 800]"
            color="var(--grid-color, #eee)" />
        <AppMapOrbits />
        <AppMapVelocity />
        <AppMapAcceleration />
        <AppMapIcons />
        <AppMapBarycenter />
        <AppMapRuler />
    </Map>
</template>

<style lang="scss" module>
    .map {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>