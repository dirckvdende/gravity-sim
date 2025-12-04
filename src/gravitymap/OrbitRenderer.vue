<script setup lang="ts">
    import PathRenderer from '@/map/renderers/PathRenderer.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { storeToRefs } from 'pinia';
    import { useOrbitHistory } from './useOrbitHistory';

    const { objects } = storeToRefs(useGravitySimStore())
    const orbits = useOrbitHistory(objects)
</script>

<template>
    <PathRenderer
        v-for="orbit in orbits"
        :points="orbit.points" />
</template>