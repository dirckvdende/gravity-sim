<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import DynamicPathRenderer from './DynamicPathRenderer.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';

    const { showOrbits } = storeToRefs(useSettingsStore())
    const { objects } = storeToRefs(useGravitySimStore())
</script>

<template>
    <DynamicPathRenderer
        v-if="showOrbits"
        v-for="{ id, position} in objects"
        :key="id"
        :point="position" />
</template>