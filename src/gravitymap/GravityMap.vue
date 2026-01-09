<script setup lang="ts">
    import MapInteractorPan from '@/components/MapInteractorPan.vue';
    import MapInteractorZoom from '@/components/MapInteractorZoom.vue';
    import Map from '@/components/Map.vue';
    import MapGrid from '@/components/MapGrid.vue';
    import { storeToRefs } from 'pinia';
    import { onMounted, useTemplateRef } from 'vue';
    import GravityIconRenderer from './GravityIconRenderer.vue';
    import OrbitRenderer from './OrbitRenderer.vue';
    import BarycenterRenderer from './BarycenterRenderer.vue';
    import Ruler from './Ruler.vue';
    import { syncRef } from '@vueuse/core';
    import { useGravityMapStore } from '@/stores/useGravityMapStore';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import VelocityRenderer from './VelocityRenderer.vue';
    import AccelerationRenderer from './AccelerationRenderer.vue';

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
        <MapGrid
            v-if="showGrid"
            :separation-interval="[2, 5]"
            :visibility-range="[15, 50, 700, 800]"
            color="var(--grid-color, #eee)" />
        <OrbitRenderer />
        <VelocityRenderer />
        <AccelerationRenderer />
        <GravityIconRenderer />
        <BarycenterRenderer />
        <Ruler />
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