<script setup lang="ts">
    import IconRenderer from '@/map/renderers/icons/IconRenderer.vue';
    import { useObjectDisplayStore } from '@/stores/useObjectDisplayStore';
    import { storeToRefs } from 'pinia';

    const { styledObjects } = storeToRefs(useObjectDisplayStore())
</script>

<template>
    <IconRenderer :icons="styledObjects.map(({ position, icon, size }) => ({
        src: icon,
        size,
        position,
    }))" />
</template>