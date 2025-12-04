<script setup lang="ts">
    import PanInteractor from '@/map/interactors/PanInteractor.vue';
    import ZoomInteractor from '@/map/interactors/ZoomInteractor.vue';
    import Map from '@/map/Map.vue';
    import GridRenderer from '@/map/renderers/GridRenderer.vue';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import { storeToRefs } from 'pinia';
    import { onMounted, useTemplateRef } from 'vue';
    import GravityIconRenderer from './GravityIconRenderer.vue';
    import OrbitRenderer from './OrbitRenderer.vue';

    const map = useTemplateRef("map")
    // Zoom out far (temporary)
    onMounted(() => {
        if (!map.value)
            return
        const { zoom } = map.value.state
        zoom(-12)
    })
    const { speed } = storeToRefs(useSettingsStore())
    speed.value = 1e3
</script>

<template>
    <Map :class="$style.map" ref="map">
        <PanInteractor />
        <ZoomInteractor />
        <GridRenderer
            :separation-interval="[2, 5]"
            :visibility-range="[15, 50, 700, 800]"
            color="var(--grid-color, #eee)" />
        <OrbitRenderer />
        <GravityIconRenderer />
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