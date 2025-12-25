<script setup lang="ts">
    import PathRenderer from '@/map/renderers/PathRenderer.vue';
    import { storeToRefs } from 'pinia';
    import { useOrbitHistoryStore } from '@/stores/useOrbitHistoryStore';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import { watch } from 'vue';
    import DynamicPathRenderer from './DynamicPathRenderer.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';

    const { showOrbits } = storeToRefs(useSettingsStore())
    const store = useOrbitHistoryStore()
    const { orbits } = storeToRefs(store)
    const { objects } = storeToRefs(useGravitySimStore())

    watch(showOrbits, () => store.clearOrbits())
</script>

<template>
    <DynamicPathRenderer
        v-if="showOrbits"
        v-for="{ id, position} in objects"
        :key="id"
        :point="position" />
</template>