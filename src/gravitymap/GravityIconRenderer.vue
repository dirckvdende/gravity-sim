<script setup lang="ts">
    import IconRenderer from '@/map/renderers/icons/IconRenderer.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { storeToRefs } from 'pinia';

    const { objects } = storeToRefs(useGravitySimStore())
</script>

<template>
    <IconRenderer :icons="objects.map(({ position, icon, size }) => ({
        src: icon,
        size,
        position,
    }))" />
</template>