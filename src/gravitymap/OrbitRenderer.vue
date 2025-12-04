<script setup lang="ts">
    import PathRenderer from '@/map/renderers/PathRenderer.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { storeToRefs } from 'pinia';
    import { useOrbitHistory } from './useOrbitHistory';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import { computed, watch } from 'vue';

    const { objects } = storeToRefs(useGravitySimStore())
    const { showOrbits } = storeToRefs(useSettingsStore())
    const maxLength = computed(() => showOrbits.value ? 1000 : 0)
    const { orbits, clearOrbits } = useOrbitHistory(objects, { maxLength })

    watch(showOrbits, () => clearOrbits())
</script>

<template>
    <PathRenderer
        v-if="showOrbits"
        v-for="orbit in orbits"
        :points="orbit.points" />
</template>