<script setup lang="ts">
    import PanInteractor from './map/interactors/PanInteractor.vue';
    import ZoomInteractor from './map/interactors/ZoomInteractor.vue';
    import Map from './map/Map.vue';
    import SVGRenderer from './map/renderers/SVGRenderer.vue';
    import GridRenderer from './map/renderers/GridRenderer.vue';
    import IconRenderer from './map/renderers/icons/IconRenderer.vue';
    import Vector2 from './util/Vector2';
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
        <IconRenderer :icons="[{
            src: './icons/earth.svg',
            position: new Vector2(10, 10),
            size: 5,
        }]" />
    </Map>
</template>

<style lang="scss" module>
</style>