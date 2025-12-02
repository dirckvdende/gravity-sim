<script setup lang="ts">
    import PanInteractor from './newmap/interactors/PanInteractor.vue';
    import ZoomInteractor from './newmap/interactors/ZoomInteractor.vue';
    import Map from './newmap/Map.vue';
    import SVGRenderer from './newmap/renderers/SVGRenderer.vue';
</script>

<template>
    <Map>
        <PanInteractor />
        <ZoomInteractor />
        <SVGRenderer>
            <circle r="10" cx="0" cy="0" fill="purple" />
        </SVGRenderer>
    </Map>
</template>

<style lang="scss" module>
</style>