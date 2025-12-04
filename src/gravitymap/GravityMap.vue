<script setup lang="ts">
    import PanInteractor from '@/map/interactors/PanInteractor.vue';
    import ZoomInteractor from '@/map/interactors/ZoomInteractor.vue';
    import Map from '@/map/Map.vue';
    import GridRenderer from '@/map/renderers/GridRenderer.vue';
    import { storeToRefs } from 'pinia';
    import { onMounted, useTemplateRef } from 'vue';
    import GravityIconRenderer from './GravityIconRenderer.vue';
    import OrbitRenderer from './OrbitRenderer.vue';
    import BarycenterRenderer from './BarycenterRenderer.vue';
    import Ruler from './Ruler.vue';
    import { syncRef } from '@vueuse/core';
    import { useGravityMapStore } from '@/stores/useGravityMapStore';
    import { useSettingsStore } from '@/stores/useSettingsStore';

    const map = useTemplateRef("map")
    const store = storeToRefs(useGravityMapStore())
    const { showGrid } = storeToRefs(useSettingsStore())

    /** Sync map state with gravity map store so it can be edited globally */
    function syncGravityMapStore(): void {
        if (!map.value)
            return
        const { position } = map.value.state
        syncRef(position, store.position, {
            direction: "both",
            immediate: true,
        })
    }

    onMounted(() => {
        // Zoom out far (temporary)
        if (!map.value)
            return
        const { zoom } = map.value.state
        zoom(-12)
        syncGravityMapStore()
    })
</script>

<template>
    <Map :class="$style.map" ref="map">
        <PanInteractor />
        <ZoomInteractor />
        <GridRenderer
            v-if="showGrid"
            :separation-interval="[2, 5]"
            :visibility-range="[15, 50, 700, 800]"
            color="var(--grid-color, #eee)" />
        <OrbitRenderer />
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