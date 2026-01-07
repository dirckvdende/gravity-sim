<script setup lang="ts">
    import IconRenderer from '@/map/renderers/icons/IconRenderer.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import { storeToRefs } from 'pinia';
    import baryCenterIcon from "@/assets/icons/barycenter.svg"

    const { showBarycenter } = storeToRefs(useSettingsStore())
    const { barycenter } = storeToRefs(useGravitySimStore())
</script>

<template>
    <IconRenderer
        v-if="showBarycenter"
        :icons="[{
            src: baryCenterIcon,
            position: barycenter,
            size: 20,
            ignoreScaling: true,
        }]" />
</template>