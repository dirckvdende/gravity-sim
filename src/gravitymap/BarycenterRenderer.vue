<script setup lang="ts">
    import IconRenderer from '@/map/renderers/icons/IconRenderer.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import { storeToRefs } from 'pinia';

    const { showBarycenter } = storeToRefs(useSettingsStore())
    const { barycenter } = storeToRefs(useGravitySimStore())
</script>

<template>
    <IconRenderer
        v-if="showBarycenter"
        :icons="[{
            src: './icons/barycenter.svg',
            position: barycenter,
            size: 20,
            ignoreScaling: true,
        }]" />
</template>