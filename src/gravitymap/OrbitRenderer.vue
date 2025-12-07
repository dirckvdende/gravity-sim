<script setup lang="ts">
    import PathRenderer from '@/map/renderers/PathRenderer.vue';
    import { storeToRefs } from 'pinia';
    import { useOrbitHistoryStore } from '@/stores/useOrbitHistoryStore';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import { watch } from 'vue';

    const { showOrbits } = storeToRefs(useSettingsStore())
    const store = useOrbitHistoryStore()
    const { orbits } = storeToRefs(store)

    watch(showOrbits, () => store.clearOrbits())
</script>

<template>
    <PathRenderer
        v-if="showOrbits"
        v-for="orbit in orbits"
        :points="orbit.points.filter((value) => value != null)" />
</template>