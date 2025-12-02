<script setup lang="ts">
    import DragInteractor from './newmap/interactors/DragInteractor.vue';
    import Map from './newmap/Map.vue';
import SVGRenderer from './newmap/renderers/SVGRenderer.vue';
</script>

<template>
    <Map>
        <DragInteractor />
        <SVGRenderer>
            <circle r="10" cx="0" cy="0" fill="purple" />
        </SVGRenderer>
    </Map>
</template>

<style lang="scss" module>
</style>