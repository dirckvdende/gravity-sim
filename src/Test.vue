<script setup lang="ts">
    import PanInteractor from './newmap/interactors/PanInteractor.vue';
    import ZoomInteractor from './newmap/interactors/ZoomInteractor.vue';
    import Map from './newmap/Map.vue';
    import GridRendererAtScale from
    './newmap/renderers/GridRendererAtScale.vue';
    import SVGRenderer from './newmap/renderers/SVGRenderer.vue';
    import GridRenderer from './newmap/renderers/GridRenderer.vue';
</script>

<template>
    <Map>
        <PanInteractor />
        <ZoomInteractor />
        <SVGRenderer>
            <circle r="10" cx="0" cy="0" fill="purple" />
        </SVGRenderer>
        <GridRenderer
            :separation-interval="[2, 5]"
            :visibility-range="[15, 50, 700, 800]"
            color="var(--grid-color, #eee)" />
    </Map>
</template>

<style lang="scss" module>
</style>